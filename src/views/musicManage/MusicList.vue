<template>
<div>
  <div>
      <mu-button
        color="primary"
        class="btn"
        v-for="(item, index) in buttonMenu"
        :key="index"
        @click="btnChange(item)"
      >{{item.title}}</mu-button>
      <mu-text-field v-model="keywords" placeholder="search"></mu-text-field>
      <mu-button color="success" @click="search()">点击搜索</mu-button>
      <!-- <Dialog :openSimple ="openSimple"></Dialog> -->
    </div>
  <div>
    <mu-tabs :value.sync="active3" center color="teal" class="tab-head">
      <mu-tab ripple v-for="(type, index) in types" :key="index" @click="changeSongList(index)">{{type.type}}</mu-tab>
    </mu-tabs>
    <!-- <mu-flex class="mu-transition-row"> -->
    <transition-group name="list" >
    <div class="demo-text" v-for="(item1, index1) in types" :key="index1" v-show="index1 === currentIndex" >
      <mu-row>
        <mu-col span="3" style="padding: 10px 10px" v-for="(item, index) in songList.slice(start, end)" :key="index">
            <v-card class="mx-auto" max-width="344">
              <v-img :src="item.thumbnail" height="200px"></v-img>
              <v-card-text class="title" style="color:white">{{item.songListName}}</v-card-text>
              <v-card-text>歌曲量： {{item.songCount}}</v-card-text>
              <v-card-text>播放量： {{item.playsCounts}}</v-card-text>
              <v-card-text>创建时间： {{item.createTime.slice(0,10)}}</v-card-text>
            </v-card>
        </mu-col>
      </mu-row>
    </div>
    </transition-group>
    <!-- </mu-flex> -->
  </div>
    <mu-flex justify-content="center">
    <mu-pagination raised circle :total="totalPage" :current.sync="currentPage"></mu-pagination>
    </mu-flex>
    <mu-flex>
    <mu-dialog title="新建歌单" width="600" :open.sync="openSimple">
      <v-form>
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="songList.name"
            label="歌单名"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="songList.thumbnail"
            label="封面"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
      <v-col span="6">
        <mu-select v-model="songList.type" label="歌单类型" >
        <mu-option v-for="(option,index) in songListTypes" :key="index" :label="option" :value="option"></mu-option>
      </mu-select>
      </v-col>
      </v-row>
    </v-form>
    <mu-button slot="actions" flat color="primary" @click="openSimple=false">Close</mu-button>
    </mu-dialog>
    </mu-flex>
  </div> 
  <!-- <div style="width: 100%">
    <div>
      <mu-button
        color="primary"
        class="btn"
        v-for="(item, index) in buttonMenu"
        :key="index"
        @click="Operation(item)"
      >{{item.title}}</mu-button>
      <mu-text-field v-model="keywords" placeholder="search"></mu-text-field>
      <mu-button color="success" @click="search()">点击搜索</mu-button>
    </div>
    <div style="display:flex;padding: 20px 20px">
      <div class="s-l-table">
        <mu-data-table
          :columns="columns"
          :data="songList.slice(start, end)"
          class="s-l-table-content"
        >
          <template slot-scope="scope">
            <td class="is-left">{{scope.row.songListId}}</td>
            <td class="is-left">{{scope.row.songListName}}</td>
            <td class="is-right">{{scope.row.songCount}}</td>
            <td class="is-right">{{scope.row.createTime.slice(0,10)}}</td>
          </template>
        </mu-data-table>
        <mu-flex justify-content="center">
          <span style="margin-top: 10px">每页显示：</span>
          <mu-select style="width:70px" v-model="size" full-widt>
            <mu-option
              v-for="(option,index) in options"
              :key="index"
              :label="option"
              :value="option"
            ></mu-option>
          </mu-select>
        </mu-flex>
      </div>
      <div class="s-l-tab">
        <div>
          <mu-tabs :value.sync="active" class="tabs">
            <mu-tab v-for="(type, index1) in types" :key="index1">{{type.type}}</mu-tab>
          </mu-tabs>
        </div>
        <div>
          <div
            class="demo-text"
            v-for="(type, index2) in types"
            :key="index2"
            style=" overflow: hidden"
          >
            <mu-data-table
              :columns="columns"
              :data="type.child"
              class="childTable"
              v-if="active == index2"
            >
              <template slot-scope="scope">
                <td class="is-left">{{scope.row.song_list_id}}</td>
                <td class="is-left">{{scope.row.song_list_name}}</td>
                <td class="is-right">{{scope.row.song_count}}</td>
                <td class="is-right">{{scope.row.create_time.slice(0,10)}}</td>
              </template>
            </mu-data-table>
          </div>
        </div>
      </div>
    </div>
  </div>-->
</template>

<script>
export default {
  name: 'MusicList',
  data() {
    return {
      sort: {
        name: '',
        order: 'asc'
      },
      options: ['5', '10', '15'],
      columns: [
        { title: 'id', width: 120, name: 'name', align: 'center' },
        { title: '名称', name: 'calories', width: 240, align: 'left', sortable: true },
        { title: '歌曲数', name: 'protein', width: 100, align: 'right', sortable: true },
        { title: '创建时间', name: 'create_time', width: 160, align: 'right', sortable: true }
      ],
      songList: [],
      buttonMenu: [],
      currentPage: 1,
      totalPage: 1000,
      size: 10,
      page: 1,
      active: 0,
      types: [],
      typeChildSongList: [],
      keywords: '',
      start: 0,
      end: 8,
      active3: 0,
      songList: {
        name: '',
        type:null,
        thumbnail: ''
      },
      currentIndex: 0,
      openSimple: false,
      songListTypes: [],
    }
  },
  created() {
    this.getSongList()
  },
  mounted() {},
  watch: {
    // 侦听器，监听当前页的数量与当前页值的变化
    size: function(newSize, oldSize) {
      this.totalPage = (1000 / this.size) * 10
      //新值与旧值进行对比
      if (newSize > oldSize) {
        this.end = this.end + (newSize - oldSize)
      } else {
        this.end = this.end - (oldSize - newSize)
      }
    },
    currentPage: function(newCurrent, oldCurrent) {
      if (newCurrent == 1000 / this.size) {
        this.page += 1
      }
      if (newCurrent < oldCurrent && newCurrent >= 0) {
        this.start -= 8
        this.end -= 8
      } else {
        this.start += 8
        this.end += 8
      }
    }
  },
  methods: {
    //按钮事件
    btnChange(item){
      switch(item.title){
        case "添加歌单":
            this.openSimple = true;
            break;
        case "删除歌单": 
            break;
        case "编辑歌单":
            break;
        case "导出歌单":
            this.Operation(item)
            break;
      }
    },
    //导出
    Operation(item) {
      this.axios({
        method: 'get',
        url: '/resources/songList',
        responseType: 'blob'
      }).then((res) => {
        // 使用Blob创建一个指向性的URL（参数， 参数的类型）
        //const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        //创建a标签节点
        const download = document.createElement('a')
        //创建url对象
        const href = window.URL.createObjectURL(res.data)
        //给超链接的href属性赋url值
        download.href = href
        //设置下载的文件名
        download.download = '歌单数据表.xls'
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

    //获取歌单
    getSongList() {
      this.axios({
        method: 'get',
        url: '/songList/page',
        params: {
          currentPage: this.page,
          size: 1000
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        this.songList = res.data.data
        this.getButtonMenu()
        this.getSongListType()
        console.log(this.songList)
      })
    },

    //模糊查询歌单
    search() {
      this.axios({
        method: 'get',
        url: '/songList/blur',
        // 问号带参，表单提交
        params: {
          field: this.keywords
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        this.songList = res.data.data
        this.totalPage = this.songList.length
        this.keywords = ''
      })
    },

    getSongListType() {
      this.axios({
        method: 'get',
        url: '/songList/type',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        //获取各种类型及属于该类型的歌单数据
        this.types = res.data.data
        console.log(this.types)
        //取出第一种类型的所有歌单，作为默认tab页上显示的数据
        this.typeChildSongList = this.types[0].child
        for(let i = 0, len = this.types.length; i < len; i++){
          let type = this.types[i]
          this.songListTypes.push(type.type)
        }
      })
    },
    //选项卡选择不同类型的歌单
    changeSongList(index){
      this.currentIndex = index
      this.songList = this.types[index].child
      this.totalPage = this.songList.length
    },
    //获取歌单中的按钮权限
    getButtonMenu() {
      for (let i = 0; i < this.$store.state.menuList.length; i++) {
        let menu = this.$store.state.menuList[i].subMenus

        if (menu != null) {
          for (let j = 0; j < menu.length; j++) {
            if (menu[j].title === '歌单管理') {
              this.buttonMenu = menu[j].subMenus
            }
          }
        }
      }
    },

    //排序
    handleSortChange({ name, order }) {
      this.list = this.list.sort((a, b) => (order === 'asc' ? a[name] - b[name] : b[name] - a[name]))
    }
  },
  computed: {}
}
</script>

<style scoped lang="scss">
.table {
  background-color: white;
  color: black;
}

.content {
  flex: 0 0 33%;
}

.btn {
  margin: 20px 20px;
}

.s-l-table {
  width: 50%;
  background-color: white;
  margin-right: 60px;
  box-shadow: 2px 2px 2px 2px #ddd;
  height: 500px;
  &-content {
    height: 450px;
    overflow-y: auto;
    overflow-x: hidden;
    margin-bottom: 10px;
  }
}

.tabs {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 120px;
  overflow-y: auto;
}

.s-l-tab {
  background-color: white;
  box-shadow: 2px 2px 2px 2px #ddd;
  height: 500px;
  display: flex;
}

.childTable {
  overflow: auto;
  max-width: 400px;
  height: 500px;
}

.tab-head {
  overflow: auto;
  z-index: 0;
}

.title {
  position: absolute;
  top: 0px;
  width: 100%;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  background-color: rgba(0,0,0,0.5);
}

::-webkit-scrollbar {
    background-color: #009688;
    width: 10px;
    height: 10px;
    background-clip: padding-box;
}

/*滚动条两端方向按钮*/
::-webkit-scrollbar-button {
    background-color: #009688;
}

/*滚动条中间滑动部分*/
::-webkit-scrollbar-thumb {
    background-color: #009688;
    border-radius: 5px;
}

/*滚动条右下角区域*/
::-webkit-scrollbar-corner {
    background-color: red;
}

.list-enter-active{
  transition: all 1.5s;
}

.list-enter{
  opacity: 0;
  transform: translateX(-30px);
}
</style>
