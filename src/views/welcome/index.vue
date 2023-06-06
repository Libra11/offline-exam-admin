<!--
 * @Author: Libra
 * @Date: 2023-03-07 14:15:32
 * @LastEditTime: 2023-06-06 11:05:58
 * @LastEditors: Libra
 * @Description: 
-->
<template>
  <div class="m-2">
    <el-tag class="mb-2">主机</el-tag>
    <div>
      <el-button class="mb-2" type="primary" @click="connectAllClient"
        >连接所有客户端</el-button
      >
    </div>
    <div class="my-2 rounded-lg shadow-[0_0_1px_#888] p-2 text-sm">
      <div class="mb-2 font-bold">当前连接用户:</div>
      <div v-for="(item, index) in socketList" :key="index">
        <span class="text-xs text-slate-700"
          >{{ index + 1 }}. 客户端ip:
          <span class="text-red-400">{{ item.id }}</span></span
        >
      </div>
    </div>
    <div class="my-2 rounded-lg shadow-[0_0_1px_#888] p-2 text-sm">
      <div class="mb-2 font-bold">所有用户:</div>
      <div v-for="(item, index) in allClient" :key="index">
        <span class="text-xs text-slate-700"
          >{{ index + 1 }}. 客户端ip:
          <span class="text-red-400">{{ item.ip }}</span></span
        >
      </div>
    </div>
    <div>
      <el-button class="my-2" type="primary" @click="getAllData"
        >获取数据库数据</el-button
      >
    </div>
    <div class="rounded-lg shadow-[0_0_1px_#888] p-2 text-sm">
      <div class="mb-2 font-bold">数据库数据:</div>
      <div v-for="(item, index) in dbData" :key="index">
        <span class="text-xs text-slate-700"
          >id:<span class="text-red-400">{{ item.id }}</span> name:<span
            class="text-red-400"
          >
            {{ item.name }}</span
          ></span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { IpcRendererEvent, ipcRenderer } from "electron";
import { db } from "@/db/test";

defineOptions({
  name: "Welcome"
});

interface SocketItem {
  EIO: string;
  id: string;
  t: string;
  transport: string;
}

interface HostItem {
  ip: string;
  mac: string;
}
const socketList = ref<Array<SocketItem>>([]);
const allClient = ref<Array<HostItem>>([]);
const dbData = ref<Array<any>>([]);

onMounted(() => {
  ipcRenderer.on("message", (event: IpcRendererEvent, arg: string) => {
    ElMessage.success(`收到客户端消息：${arg}`);
    insertData(arg);
  });
  ipcRenderer.on("hosts", (event: IpcRendererEvent, arg: string) => {
    allClient.value = JSON.parse(arg);
  });
  ipcRenderer.on("updateSocketList", (event: IpcRendererEvent, arg: string) => {
    console.log("updateSocketList", JSON.parse(arg));

    socketList.value = JSON.parse(arg);
  });
});

const insertData = async (name: string) => {
  try {
    // Add the new friend!
    await db.friends.add({
      name,
      age: 15
    });
  } catch (error) {
    console.error(error);
  }
};

const getAllData = async () => {
  dbData.value = await db.friends.toArray();
};

const connectAllClient = () => {
  ipcRenderer.send("connectAllClient");
};
</script>
