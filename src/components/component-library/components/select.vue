<template>
    <div class="box">
        <el-select v-model="value" clearable :size="setData.selectSize" :placeholder="setData.placeholder">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" ></el-option>
        </el-select>
    </div>
</template>

<script>
export default {
    data() {
        return {
            options: [
                { value: "选项1", label: "黄金糕" },
                { value: "选项2", label: "双皮奶" },
                { value: "选项3", label: "蚵仔煎" }
            ],
            value  : "",
        };
    },
    props: {
        setData: { type: Object | Array },
    },
};
</script>
