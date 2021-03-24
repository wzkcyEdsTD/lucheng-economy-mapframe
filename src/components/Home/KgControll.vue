<template>
  <div class="kgForm" v-if="_display_">
    <header>控规匹配-辅助绘画</header>
    <b-form class="kg_form" @submit="onSubmit">
      <b-form-group :id="`input-group-1`" label="地块编号" label-for="input-1">
        <b-form-input :id="`input-1`" :required="true" v-model="code" type="text"></b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary">匹配</b-button>
      <b-button class="clear" @click="clearKg">清除控规</b-button>
    </b-form>
    <b-list-group class="kgs_group">
      <b-list-group-item v-for="(item,index) in Kgs" :key="index" @click="goKg(item)">
        <p>地块编号: {{item.DKBH}}</p>
        <p>用地性质: {{item.YDXZ}}</p>
      </b-list-group-item>
      <b-list-group-item class="kgs_group_none" v-if="!Kgs.length">
        <p>-未找到匹配结果-</p>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState } from "vuex";
export default {
  name: "kgForm",
  data() {
    return {
      code: undefined,
      Kgs: []
    };
  },
  computed: {
    ...mapState({
      kgs: state => state.kgs
    }),
    _display_() {
      return this.$params && this.$params.mode == "polygon";
    }
  },
  watch: {
    kgs(val) {
      this.Kgs = val;
    }
  },
  methods: {
    /**
     * 表单提交函数 触发Validation
     * @param {Object} evt   事件体
     */
    onSubmit(evt) {
      evt.preventDefault();
      console.log("[code]", this.code);
      this.$parent.$refs.arcgis.kgControll(true, this.code);
    },
    clearKg() {
      this.$parent.$refs.arcgis.kgControll(false);
    },
    goKg(kg) {
      this.$parent.$refs.arcgis.kgMove(kg);
    }
  }
};
</script>

<style lang="less">
.kgForm {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px #fff solid;
  border-radius: 4px;
  padding: 6px 10px;
  text-align: left;
  border-bottom: 1px #aaa solid;
  margin-bottom: 10px;
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
  .clear {
    margin-left: 10px;
  }
  .kgs_group {
    border-top: 1px #aaa solid;
    .list-group-item {
      cursor: pointer;
      background-color: unset;
      border: 0;
      border-bottom: 1px #aaa solid;
      padding: 2px 6px;
      p {
        margin: 0;
      }
    }
    .kgs_group_none {
      text-align: center;
    }
  }
}
</style>