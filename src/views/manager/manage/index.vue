<!--
 * @Author: Libra
 * @Date: 2023-06-12 14:36:39
 * @LastEditors: Libra
 * @Description: 
-->
<template>
  <div class="m-2">
    <cus-dialog
      title="添加考试机"
      v-model="showAddMachineDialog"
      :show-close="true"
      @confirm="addMachine"
      width="800"
    >
      <div class="flex justify-between">
        <div class="flex w-80">
          <el-input v-model="ip.first" class="mb-2" />.
          <el-input v-model="ip.second" class="mb-2" />.
          <el-input v-model="ip.third" class="mb-2" />.
          <el-input v-model="ip.fourthStart" class="mb-2" />~
          <el-input v-model="ip.fourthEnd" class="mb-2" />
        </div>
        <div>
          <el-button class="mb-2" type="primary" @click="findClients"
            >扫描</el-button
          >
        </div>
      </div>
      <el-table
        :data="Array.from(allClient.values())"
        @selection-change="handleSelectionChange"
        :row-key="row => row.ip"
        @select-all="selectAll"
        :default-sort="{ prop: 'ip', order: 'descending' }"
        style="width: 100%; max-height: 600px; overflow: auto"
      >
        <el-table-column
          type="selection"
          width="40"
          :reserve-selection="true"
        />
        <el-table-column prop="seatNum" label="座位号" width="80" />
        <el-table-column prop="ip" sortable label="ip" width="180" />
        <el-table-column prop="version" label="版本" width="60" />
        <el-table-column prop="useStatus" label="状态" />
        <el-table-column prop="operate" label="操作" />
      </el-table>
    </cus-dialog>
    <div class="flex justify-between">
      <div>
        <span>
          已注册考试机：{{ clientStore.onlineClientNum }}/{{
            clientStore.allClientNum
          }}</span
        >
        <el-select
          v-model="selectOp"
          class="m-2"
          placeholder="Select"
          @change="optionChange"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div>
        <el-dropdown>
          <el-button type="primary">
            批量操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>启动App</el-dropdown-item>
              <el-dropdown-item>关闭App</el-dropdown-item>
              <el-dropdown-item>关机</el-dropdown-item>
              <el-dropdown-item>重启</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button
          @click="showAddMachineDialog = true"
          type="primary"
          class="ml-2"
          >添加考试机器</el-button
        >
      </div>
    </div>
    <el-table :data="clients" style="width: 100%; margin-top: 0.5rem">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="seatNum" label="座位号" width="80" />
      <el-table-column prop="ip" sortable label="ip" width="180" />
      <el-table-column prop="version" label="版本" width="100" />
      <el-table-column prop="onlineStatus" label="状态" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default>
          <el-button link type="primary" size="small">修改座位号</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRaw, onBeforeUnmount, watch } from "vue";
import { ElMessage, ElTable } from "element-plus";
import { IpcRendererEvent, ipcRenderer } from "electron";
import { getLocalIpAddress } from "@electron/util";
import CusDialog from "@/components/CusDialog/index.vue";
import { ClientItem } from "myTypes";
import { clientStore } from "@/store/modules/client";
import { ArrowDown } from "@element-plus/icons-vue";

const showAddMachineDialog = ref(false);

defineOptions({
  name: "Welcome"
});

const allClient = ref(new Map<string, ClientItem>());
const clients = ref<ClientItem[]>([]);
const ip = ref({
  first: 0,
  second: 0,
  third: 0,
  fourthStart: 1,
  fourthEnd: 255
});
let localIp = "";

onMounted(async () => {
  createServer();
  ipcRendererEvent();
  getLocalIpSgement();
  await getInitData();
});
onBeforeUnmount(() => {
  ipcRenderer.removeAllListeners("message");
  ipcRenderer.removeAllListeners("host");
  ipcRenderer.removeAllListeners("host-update");
});

watch(
  () => clientStore.data,
  newVal => {
    clients.value = newVal;
  }
);

// get store and db data
const getInitData = async () => {
  await clientStore.getAllData();
};

const getLocalIpSgement = () => {
  localIp = getLocalIpAddress();
  const ipArr = localIp.split(".");
  [ip.value.first, ip.value.second, ip.value.third] = ipArr.map(Number);
};

const ipcRendererEvent = () => {
  ipcRenderer.on("message", (event: IpcRendererEvent, arg: string) => {
    ElMessage.success(`收到客户端消息：${arg}`);
  });
  ipcRenderer.on("host", (event: IpcRendererEvent, arg: string) => {
    const data = JSON.parse(arg);
    allClient.value.set(data.ip, data);
    console.log("allClient", allClient.value);
  });
};

const addMachine = () => {
  selectedClient.map((item: ClientItem) => clientStore.insertData(toRaw(item)));
  showAddMachineDialog.value = false;
  clientStore.getAllData();
  connectClients();
};

// find all clients that match the ip segment & have mac address
const findClients = () => {
  ipcRenderer.send("find-clients", JSON.stringify(ip.value));
};

// create socket server
const createServer = () => {
  ipcRenderer.send("create-server");
};

// send manager machine ip to clients, so that clients can connect to manager
const connectClients = () => {
  ipcRenderer.send(
    "connect-clients",
    JSON.stringify({
      localIp,
      clients: selectedClient.map((item: ClientItem) => item.ip)
    })
  );
};

/**
 * dialog selection
 */
let seatNum = 0;
let selectedClient: Array<ClientItem> = [];
const handleSelectionChange = (val: Array<ClientItem>) => {
  selectedClient = val;
  if (val.length === 0) {
    seatNum = 0;
    // set allClient Map seatNum 0
    allClient.value.forEach((item: ClientItem) => {
      item.seatNum = 0;
    });
    return;
  }
  seatNum += 1;
  val[val.length - 1].seatNum = seatNum;
};
const selectAll = (selection: Array<ClientItem>) => {
  // reset seatNum
  seatNum = 0;
  selection.forEach((item, index) => {
    item.seatNum = index + 1;
  });
};

/**
 * select options
 */
const selectOp = ref("0");

const options = [
  {
    value: "0",
    label: "全部考试机"
  },
  {
    value: "1",
    label: "在线"
  },
  {
    value: "2",
    label: "离线"
  },
  {
    value: "3",
    label: "已启动"
  }
];
const optionChange = (val: string) => {
  console.log(val);
  switch (val) {
    case "0":
      clients.value = clientStore.data;
      break;
    case "1":
      clients.value = clientStore.data.filter(
        (item: ClientItem) => item.onlineStatus === "online"
      );
      break;
    case "2":
      clients.value = clientStore.data.filter(
        (item: ClientItem) => item.onlineStatus === "offline"
      );
      break;
    case "3":
      clients.value = clientStore.data.filter(
        (item: ClientItem) => item.onlineStatus === "launched"
      );
      break;
    default:
      break;
  }
};
</script>
