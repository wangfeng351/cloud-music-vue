<template>
  <div class="container1">
      <div class="operation">
        <span  v-for="(item, index) in buttonMenu" :key="index">
        <mu-button class="operationBtn" color="" @click="openSimple=true" v-if="item.title === '批量删除'">
         <mu-icon left :value="item.icon"></mu-icon>
         {{item.title}}
        </mu-button>

        <mu-dialog title="删除提醒" width="360" :open.sync="openSimple">
        确定删除？
        <mu-button slot="actions" flat color="primary" @click="batchDelete()">确定</mu-button>
        <mu-button slot="actions" flat color="primary" @click="openSimple=false">取消</mu-button>
        </mu-dialog>

         <mu-button color="error" @click="openAlertDialog()" v-if="item.title === '批量导入'">
          <mu-icon left :value="item.icon"></mu-icon>
          {{item.title}}
        </mu-button>
        </span>
        <mu-dialog title="批量导入注意事项" style="line-height: 30px" width="600" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="openAlert">
    批量导入时必须严格按照模板样式，没有模板请
    <span @click="downloadModel()" style="color:#1a73e8;font-weight:600;cursor: pointer;">下载模板</span>
    ,如已根据模板填写，请
    <span style="color:#1a73e8;font-weight:600;cursor: pointer;"> 继续导入</span>
    <input type="file" class="open-file" name="fileBox" id="fileBox" multiple @change="importSong($event)">
    <mu-button slot="actions" flat color="primary" @click="closeAlertDialog()">取消</mu-button>
  </mu-dialog>
      </div>
      <div class="song-table">
      <p class="search">
       <span>
          日期筛选：
      <mu-select v-model="dateFilter" class="data-selection" @change="filterSong()">
        <mu-option v-for="(option,index) in options" :key="index" :label="option.key" :value="option.value"></mu-option>
      </mu-select>
       </span>
       <span>
       <mu-text-field v-model="keywords" placeholder="输入关键词搜索"></mu-text-field>
        <mu-button color="success" @click="getSongByKeywords()">搜索</mu-button>
       </span>
      </p>
      <p class="header">
      <span>
      歌曲id
      </span>
      <span>歌曲名称</span>
      <span>歌手</span>
      <span>发行时间</span></span>
      <span>操作</span>
      </p>
      <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load">
      <mu-list>
        <template v-for="item in songs.slice(start, end)">
          <mu-list-item>
            <mu-list-item-title>
            <span class="first-c">
            <mu-checkbox :value="item.songId" v-model="checkbox.value1"></mu-checkbox>
            {{item.songId}}
            </span>
            </mu-list-item-title>
            <mu-list-item-title>
            <span>{{item.songName}}</span>
            </mu-list-item-title>
            <mu-list-item-title>
            <span>
            {{item.singer}}
            <mu-icon left value="favorite" v-if="item.singer === 'G.E.M.邓紫棋'" color="#d50000"></mu-icon>
            </span>
            </mu-list-item-title>
            <mu-list-item-title>
            <span>{{item.createTime.substring(0,10)}}</span>
            </mu-list-item-title>
            <mu-list-item-action v-for="(item1, index) in buttonMenu" :key="index" style="justify-content:center;">
            <mu-button @click="singleDelete(item.songId)" color="error" v-if="item1.title === '删除'">
            <mu-icon left :value="item1.icon"></mu-icon>
            {{item1.title}}</mu-button>
            </mu-list-item-action>
          </mu-list-item>
          <mu-divider />
        </template>
      </mu-list>
    </mu-load-more>
      </div>
 </div>
</template>

<script>
export default {
 name: 'Music',
  data() {
    return {
      openSimple: false,
      songs: [],
      refreshing: false,
      loading: false,
      text: 'List',
      start: 0,
      end: 10,
      buttonMenu: [],
      options: [
        {key: "一周内", value: "week"},
        {key: "本月", value: "month"},
        {key: "本季度", value: "quarter"}
      ],
      dateFilter: '',
      keywords: '',
      openAlert: false,
      checkbox: {
        value1: [],
      },
      checkAll: ''
    }
  },
  components: {},
  created() {
    this.getSong()
  },
  mounted() {},
  methods: {
    refresh () {
      this.refreshing = true;
      this.$refs.container.scrollTop = 0;
      setTimeout(() => {
        this.refreshing = false;
        this.num = 10;
      }, 2000)
    },
    load () {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.end += 10;
      }, 2000)
    },
    
    getSong(){
      this.axios({
        method: 'get',
        url: '/song/list',
      }).then((res) => {
        this.songs =res.data.data
        this.getButtonMenu()
      })
    },

    //获取歌单中的按钮权限
    getButtonMenu() {
      for (let i = 0; i < this.$store.state.menuList.length; i++) {
        let menu = this.$store.state.menuList[i].subMenus

        if (menu != null) {
          for (let j = 0; j < menu.length; j++) {
            if (menu[j].title === '歌曲管理') {
              this.buttonMenu = menu[j].subMenus
              console.log(menu[j])
            }
          }
        }
      }
    },

    //日期筛选
    filterSong(){
      this.axios({
        method: 'get',
        url: 'song/paragraph',
        params: {
          flag: this.dateFilter
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        console.log(res.data)
        this.songs =res.data.data
      })
    },

    //关键词搜索
    getSongByKeywords(){
      this.axios({
        method: 'get',
        url: 'http://localhost:8080/song/blur',
        params: {
          field: this.keywords
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        console.log(res.data)
        this.songs =res.data.data
      })
    },
    //批量导入遮罩层
    openAlertDialog () {
      console.log(123456)
      this.openAlert = true;
    },
    closeAlertDialog () {
      this.openAlert = false;
    },

    //批量删除
    batchDelete(){
      let id = ''
      for(let i = 0; i < this.checkbox.value1.length; i++){
        id = id + this.checkbox.value1[i] + ','
      }
      console.log(id)
      this.axios({
        method: 'delete',
        url: this.GLOBAL.baseUrl + '/song/many',
        params: {
          id: id
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        console.log(res.data)
        if(res.data.code == 1){
          alert("删除成功")
          this.openSimple = false
          this.getSong()
        }
      })
    },
    //单个删除
    singleDelete(id){
      this.axios({
        method: 'delete',
        url: '/song/single/' + id,
      }).then((res) => {
        console.log(res.data)
        if(res.data.code == 1){
          alert("删除成功")
          this.openSimple = false
          this.getSong()
        }
      })
    },


    //导入、下载模板
    downloadModel(){
      this.axios({
        method: 'get',
        url: 'http://localhost:8080/resources/model',
        responseType: 'blob'
      }).then((res) => {
        //指定类型位excel表类型
        const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        //创建a标签节点
        const download = document.createElement('a')
        //与获取验证码url方法一样
        const href = window.URL.createObjectURL(blob)
        //给超链接的href属性赋url值
        download.href = href
        //设置下载的文件名
        download.download = '歌曲批量导入模板.xls'
        //将a标签放在body中
        document.body.appendChild(download)
        //给a标签生成一个点击事件
        download.click()
        //移除a标签，为了下次点击时创建
        document.body.removeChild(download)
        //移除url
        window.URL.revokeObjectURL(href)
      })
    },

    //批量导入
    importSong(event){
        // console.log(event)
        //新构建一个表单
        let formData = new FormData();
        //如果多个文件，对文件进行遍历
				for (let j = 0; j < event.target.files.length; j++) {
          //以键值对关系存入表单
					formData.append('file', event.target.files[j]);
        }
        this.axios({
						method: 'post',
            url: '/resources/guide',
            data: formData,
						headers: {
							'Content-Type': 'multipart/form-data'
						}
					}).then(res => {
            if(res.data.code == 1){
              alert('导入成功')
            }
					}); 
        
    },


  },
  computed: {}
}
</script>

<style scoped lang="scss">
  .container1 {
    width: 100%;
    //操作按钮
    .operation {
      display: flex;
      margin-top: 20px;
      margin-left: 60px;
    }
    .song-table {
      margin: 10px auto;
      width: 90%;
      padding: 10px 10px;
      box-shadow: 0px 2px 2px 4px #8e44ad;
      min-height: 600px;
      background-color: #c9d6ff;
      .search {
        display: flex;
        justify-content: space-between;
        .mu-button {
          margin-left: 10px;
        }
      }
      .header {
        width: 100%;
        display: flex;
        align-items: center;
        height: 60px;
        border-bottom: 1px solid rgb(205, 205, 205);
        span {
          flex: 0 0 20%;
          text-align: center;
          .data-selection {
            width: 60px;
          }
        }
      }
      .mu-list-item {
        width: 100%;
        display: flex;
        background-color: red;
        span {
          flex: 0 0 16.5%;
        }
      }
    }
  }
  .open-file {
    opacity: 0;
    position: relative;
    right: 80px;
  }

  .first-c {
    display:flex;
    align-items: center;
  }

  .operationBtn {
    margin-right: 20px;
    margin-left: 20px;
  }
</style>
