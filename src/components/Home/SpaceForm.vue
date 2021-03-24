<template>
  <div class="spaceForm" v-if="spaceHash">
    <header>
      空间化信息
      <i>{{!located ? '(未空间化)':''}}</i>
    </header>
    <b-form @submit="onSubmit">
      <!-- <b-form-group
        v-for="(item,key,index) in spaceHash"
        :key="index"
        :id="`input-group-${index}`"
        :label="item.link"
        :label-for="`input-${index}`"
      >
        <b-form-input
          :id="`input-${index}`"
          v-model="attributes[key]"
          :type="item.type || 'text'"
          :required="item.required"
          :disabled="item.disabled"
        ></b-form-input>
      </b-form-group>-->
      <div v-if="_mode === 'point'">
        <!-- <p>点击地图,进行空间化落点</p> -->
        <b-button class="baidu_hit_draw" @click="()=>{ $parent.queryByBaidu() }">自动匹配</b-button>
        <space-info v-if="locate" />
      </div>
      <div v-if="_mode === 'polygon'">
        <!-- <p>在地图上绘画块状,完成空间化落点</p> -->
        <b-button class="home_hit_draw" @click="()=>{ $parent.queryType('polygon') }">绘制地块</b-button>
        <space-info v-if="locate" />
      </div>
      <b-button
        class="home_hit_commit"
        type="submit"
        variant="primary"
        v-bind:disabled="!locate && !located"
        v-b-modal.modal-1
      >提交空间化信息</b-button>
    </b-form>
    <b-modal
      id="modal-1"
      title="提交"
      @ok="()=>{pre_commitSpace(attributes)}"
      ok-title="确认"
      cancel-title="取消"
    >
      <p class="my-4">确认提交空间数据?</p>
    </b-modal>
  </div>
</template>

<script>
/* eslint-disable */
import { loadModules } from "esri-loader";
import { mapState, mapMutations, mapActions } from "vuex";
import SpaceInfo from "@/components/Home/SpaceInfo";
import { OPTION } from "@/components/common/config";
export default {
  name: "spaceForm",
  components: { SpaceInfo },
  data() {
    return {
      attributes: {}
    };
  },
  computed: {
    ...mapState({
      single: state => state.single,
      locate: state => state.locate,
      located: state => state.located,
      spaceHash: state => state.spaceHash,
      spaceValHash: state => state.spaceValHash
    }),
    /**
     * 空间落点类型
     * [point]    点
     * [polygon]  面
     */
    _mode() {
      return this.$params && this.$params instanceof Object
        ? this.$params.mode
        : undefined;
    }
  },
  methods: {
    ...mapActions(["commitSpace"]),
    /**
     * 调用form页面传递数据
     * @param {Object} attributes   请求后获取的属性表
     */
    getAttributes(attributes) {
      this.attributes = JSON.parse(JSON.stringify(attributes));
    },
    /**
     * 表单验证成果后写入数据库
     * @param {Object} attributes   表单信息
     */
    async pre_commitSpace(attributes) {
      const { value, mode } = this.$params;
      const geometry = this.locate
        ? this.locate.geometry
        : this.located.geometry;
      if (
        !Object.keys(this.spaceValHash).length ||
        !Object.keys(this.spaceHash).length
      )
        return this.$parent.makeToast(
          "提示",
          "该服务空间化功能正在开发,请关注后续更新"
        );
      const { s_table, s_key, s_primary } = this.spaceValHash;
      //  shape语句
      let Shape;
      switch (mode) {
        case "point": {
          const { x, y } = geometry;
          Shape = `geometry::STGeomFromText('point (${x} ${y})',4490)`;
          break;
        }
        case "polygon": {
          const rings = geometry.rings[0];
          Shape = `geometry::STGeomFromText('POLYGON ((${rings
            .map(item => {
              return `${item[0]} ${item[1]}`;
            })
            .join(`,`)}))',4490)`;
          break;
        }
      }
      console.log({ [s_key]: this.single[s_key] });
      await this.commitSpace({
        s_table,
        s_key,
        s_primary,
        value,
        attributes: {
          ...this.attributes,
          Shape,
          [s_key]: this.single[s_key]
        },
        hash: this.spaceHash
      });
      return this.$parent.makeToast(
        "提示",
        "更新成功，由于存在缓存，更改12小时后生效!"
      );
    },
    /**
     * 表单提交函数 触发Validation
     * @param {Object} evt   事件体
     */
    onSubmit(evt) {
      evt.preventDefault();
      console.log("[form]", this.attributes);
    }
  }
};
</script>

<style lang="less">
.spaceForm {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px #fff solid;
  border-radius: 4px;
  padding: 6px 10px 2px 10px;
  text-align: left;
  border-bottom: 1px #aaa solid;
  header {
    height: 35px;
    line-height: 35px;
    font-size: 18px;
    font-weight: bold;
    word-break: break-all;
    i {
      color: darkred;
      font-size: 16px;
      font-style: normal;
    }
  }
  .form-group {
    margin-bottom: 6px;
    label {
      margin: 0px;
    }
    .form-control {
      line-height: 30px;
      height: 30px;
      padding: 0 0.75rem;
    }
  }
  > div {
    overflow: hidden;
  }
  .btn {
    margin: 8px 0;
    height: 30px;
    line-height: 30px;
    padding: 0px 12px;
  }
  .home_hit_draw {
    margin: 6px 0;
  }
}
</style>