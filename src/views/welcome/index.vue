<!--
 * @Author: Libra
 * @Date: 2023-03-07 14:15:32
 * @LastEditTime: 2023-06-09 15:21:39
 * @LastEditors: Libra
 * @Description: 
-->
<template>
  <div class="m-2">
    <el-tag class="mb-2">主机</el-tag>
    <div class="mb-2 font-bold">选择ip段:</div>
    <div class="flex">
      <el-input v-model="ip.first" class="mb-2" />.
      <el-input v-model="ip.second" class="mb-2" />.
      <el-input v-model="ip.third" class="mb-2" />.
      <el-input v-model="ip.fourthStart" class="mb-2" />~
      <el-input v-model="ip.fourthEnd" class="mb-2" />
    </div>
    <div>
      <el-button
        class="mb-2"
        type="primary"
        @click="connectAllClient"
        :loading="loadingClient"
        >连接所有客户端</el-button
      >
    </div>
    <div class="my-2 rounded-lg shadow-[0_0_1px_#888] p-2 text-sm">
      <div class="mb-2 font-bold">所有用户:</div>
      <div v-for="(item, index) in allClient.values()" :key="index">
        <span class="text-xs text-slate-700"
          >{{ index + 1 }}. 客户端ip:
          <span class="text-red-400">{{ item.ip }}</span></span
        >
        <span>版本:{{ item.version }}</span>
        <span>状态:{{ item.status }}</span>
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
import { getLocalIpAddress } from "../../../electron/util";

defineOptions({
  name: "Welcome"
});

interface ClientItem {
  ip: string;
  status: "online" | "offline" | "launched";
  version: string;
}

const allClient = ref(new Map<string, ClientItem>());
const dbData = ref<Array<any>>([]);
const ip = ref({
  first: 100,
  second: 21,
  third: 21,
  fourthStart: 1,
  fourthEnd: 255
});
let localIp = "";

onMounted(() => {
  ipcRendererEvent();
  getLocalIpSgement();
});

const getLocalIpSgement = () => {
  localIp = getLocalIpAddress();
  const ipArr = localIp.split(".");
  ip.value.first = +ipArr[0];
  ip.value.second = +ipArr[1];
  ip.value.third = +ipArr[2];
};

const loadingClient = ref(false);
const ipcRendererEvent = () => {
  ipcRenderer.on("message", (event: IpcRendererEvent, arg: string) => {
    ElMessage.success(`收到客户端消息：${arg}`);
    // insertData(arg);
  });
  ipcRenderer.on("hosts", (event: IpcRendererEvent, arg: string) => {
    allClient.value = new Map(Object.entries(JSON.parse(arg)));
    loadingClient.value = false;
  });
  ipcRenderer.on("host", (event: IpcRendererEvent, arg: string) => {
    const data = JSON.parse(arg);
    allClient.value.set(data.ip, data);
  });
};

// const insertData = async (name: string) => {
//   try {
//     // Add the new friend!
//     await db.friends.add({
//       name,
//       age: 15
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };

const getAllData = async () => {
  dbData.value = await db.friends.toArray();
};

const connectAllClient = () => {
  loadingClient.value = true;
  ipcRenderer.send("connectAllClient", JSON.stringify(ip.value));
};
</script>
