<template>
  <div class="spaceDetail">
    <header>数据详情</header>
    <ul>
      <li v-for="(item,key,index) in valHash" :key="index">
        <label>{{item.link}}:</label>
        <span>{{single[key]}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState, mapActions } from "vuex";
export default {
  name: "spaceDetail",
  data() {
    return {};
  },
  mounted() {
    this.fetchSingle();
  },
  computed: {
    ...mapState({
      single: state => state.single,
      valHash: state => state.valHash,
      tableHash: state => state.tableHash
    })
  },
  methods: {
    ...mapActions(["fetchData"]),
    async fetchSingle() {
      const { value } = this.$params;
      const table = this.tableHash;
      this.valHash && Object.keys(this.valHash).length
        ? await this.fetchData({
            value,
            table,
            valHash: this.valHash,
            makeToast: this.$parent.makeToast
          })
        : this.$parent.makeToast("提示", "未找到该数据信息");
    }
  }
};
</script>

<style scoped lang="less">
.spaceDetail {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px #fff solid;
  border-radius: 4px;
  padding: 6px 10px;
  text-align: left;
  margin-bottom: 10px;
  header {
    height: 35px;
    line-height: 35px;
    font-size: 18px;
    font-weight: bold;
  }
  ul {
    list-style: none;
    margin: 0px;
    padding: 0px;
    li {
      width: 400px;
      display: flex;
      line-height: 32px;
      border-bottom: 1px #adadad solid;
      label {
        width: 150px;
        margin-bottom: 0px;
      }
    }
    li:last-child {
      border-bottom: 0px;
    }
  }
}
</style>