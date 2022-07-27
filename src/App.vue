<template>
  <div id="app">
    <el-header
      class="td-header"
      style="display: flex; height: 40px; padding: 0"
    >
      <el-input
        placeholder="请输入待办事项"
        class="td-input"
        :value="inputValue"
        @input="handleInputChange"
      ></el-input>
      <el-button type="primary" @click="addItemToList">添加事项</el-button>
    </el-header>
    <el-main class="td-main">
      <el-table
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        :data="infoList"
        :cell-class-name="delLine"
        style="width: 100%"
        @select="statusChanged"
        @select-all="statusChangedAll"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="待办事项" width="350">
          <template slot-scope="item">{{ item.row.info }}</template>
        </el-table-column>
        <el-table-column prop="name" label="删除" width="50">
          <el-button
            slot-scope="item"
            size="mini"
            class="btn-close"
            type="primary"
            icon="el-icon-close"
            circle
            @click="removeItemById(item.row.id)"
          ></el-button>
        </el-table-column>
      </el-table>
      <div class="footer">
        <span>{{ unDoneLength }}条剩余</span>
        <el-radio-group size="small" v-model="radio1" @change="changeList">
          <el-radio-button class="btn-radio" label="全部"></el-radio-button>
          <el-radio-button class="btn-radio" label="未完成"></el-radio-button>
          <el-radio-button class="btn-radio" label="已完成"></el-radio-button>
        </el-radio-group>
        <el-button @click="clean">清除已完成</el-button>
      </div>
    </el-main>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "app",
  data() {
    return {
      radio1: "全部",
      multipleSelection: [],
    };
  },
  created() {
    this.$store.dispatch("getList");
  },
  computed: {
    ...mapState(["list", "inputValue", "viewKey"]),
    ...mapGetters(["unDoneLength", "infoList"]),
  },
  methods: {
    handleInputChange(val) {
      this.$store.commit("setInputValue", val);
    },
    addItemToList() {
      if (this.inputValue.trim().length <= 0) {
        return this.$message.warning("添加事项不能为空！");
      }
      this.$store.commit("addItem");
    },
    removeItemById(id) {
      this.$store.commit("removeItem", id);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    checked() {
      this.$nextTick(() => {
        this.list.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row, row.done);
        });
      });
    },
    statusChanged(val, row) {
      const param = {
        id: row.id,
        status: !row.done,
      };

      this.$store.commit("changeStatus", param);
    },
    statusChangedAll(val) {
      if (val.length !== 0) {
        this.$store.commit("changeStatusAll");
      } else {
        this.$store.commit("cleanStatusAll");
      }
    },
    clean() {
      this.$store.commit("cleanDone");
    },
    changeList(key) {
      this.$store.commit("changeViewKey", key);
    },
    delLine({ row }) {
      if (row.done) {
        return "del_line";
      }
    },
  },
  watch: {
    list: function () {
      this.checked();
    },
    infoList: function () {
      this.checked();
    },
  },
};
</script>

<style>
#app {
  width: 610px;
  margin: 0 auto;
}
.td-input {
  width: 500px;
  margin-right: 10px;
}
.td-main {
  width: 500px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
.btn-close {
  float: right;
}
.el-button--mini.is-circle {
  padding: 3px;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}
.del_line:nth-child(2)::after {
  content: no-open-quote;
  position: absolute;
  top: 51%;
  left: 0;
  width: 100%;
  border-bottom: 1px solid #000;
}
</style>

