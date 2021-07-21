<template>
  <div class="dialog">
    <el-dialog
      :title="title"
      @close="close"
      :visible.sync="dialogShow"
      width="600px"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="表中文名:" prop="tableName">
          <el-input
            v-model="form.tableName"
            placeholder="请输入表中文名"
          ></el-input>
        </el-form-item>
        <el-form-item label="表名:" prop="tableName">
          <el-input
            v-model="form.EnTableName"
            placeholder="请输入表名"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述:" prop="name">
          <el-input
            type="textarea"
            placeholder="请输入描述"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="form.name"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false" plain>取 消</el-button>
        <el-button type="primary" @click="submit('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        tableName: "",
        name: "",
        EnTableName: "",
        // nameUrl: "",
      },
      title: "新增",
      dialogShow: false,
      rules: {
        tableName: [
          { required: true, message: "请输入表中文名", trigger: "blur" },
        ],
        EnTableName: [
          { required: true, message: "请输入表名", trigger: "blur" },
        ],
        name: [{ required: true, message: "描述", trigger: "blur" }],
      },
    };
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.title === "新增") {
            this.$emit("sub", this.form);
          } else {
            this.$emit("edit", this.form);
          }
          this.dialogShow = false;
        }
      });
    },
    close() {
      this.$refs["form"].resetFields();
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/.el-dialog__header {
  position: relative;
  padding: 0px 25px;
  line-height: 40px;
  background: #f7f7f7;
  > span {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #333333;
  }
  .el-dialog__headerbtn {
    top: 12px;
  }
}
</style>
