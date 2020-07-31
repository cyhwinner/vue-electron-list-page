<template>
  <div class="wrapper">
    <p class="mirror-title">自动生成搜索页</p>
    <div class="generate-x">
      <select @change="handleChangeTemplate" v-model="template.type">
        <option value="page">列表页</option>
        <option value="modal">弹窗</option>
      </select>
      <button class="mirror-btn mirror-btn-primary" @click="handleCopy">复制页面</button>
    </div>
    <section class="mirror-x">
      <textarea class="mirror-area mirror-json" ref="mirrorJson" ></textarea>
      <textarea class="mirror-area mirror-page" ref="mirrorPage"></textarea>
    </section>
  </div>
</template>

<script>
  import CodeMirror from 'codemirror'
  import fs from 'fs-extra'
  import path from 'path'
  import ejs from 'ejs'
  
  let mirrorTimer = null
  // const TEMPLATE_MAP = {
  //   'page': ['pageTemplate.ejs', 'pageTemplate.json'],
  //   'modal': ['modalTemplate.ejs', 'modalTemplate.json']
  // }
  export default {
    name: 'landing-page',
    data() {
      return {
        mirror: '',
        template: {
          type: 'page'
        }
      }
    },
    mounted() {
      this.initJson();
      this.initPage();
    },
    methods: {
      initJson() {
        this.mirrorJson = CodeMirror.fromTextArea(this.$refs.mirrorJson, {
          lineNumbers: true,
          mode: 'application/json',
          theme: 'dracula',
          lineWrapping: true,
          autoCloseBrackets: true,
          tabSize: 2
        })

        this.mirrorJson.on('change', this.handleChangeMirror())
        this.mirrorJson.setSize('50%', '900px')
        console.log(__dirname)
        fs.readFile(path.resolve(__static, `template/pageTemplate.json`), (err, data) => {
          if (err) {
            alert(err);
            return;
          }
          this.mirrorJson.setValue(data.toString())
        })
      },
      initPage() {
        this.mirrorPage = CodeMirror.fromTextArea(this.$refs.mirrorPage, {
          lineNumbers: true,
          mode: 'text/x-vue',
          theme: 'dracula',
          // gutters:["CodeMirror-lint-markers"],
          lint: true,
          readOnly: true,
          tabSize: 2
        })
        this.mirrorPage.setSize('50%', '900px')
        
      },
      formatData(model, renderData) {
        return Object.entries(model).reduce((pre, modelItem) => {
          if (!modelItem[1].label) {
            modelItem[1] = {
              type: 'normal',
              label: modelItem[1]
            }
          }

          if(modelItem[1].type !== 'normal') {
            if (modelItem[1].type === 'map') {
              let modelItemMap = JSON.parse(modelItem[1].map)
              if (Array.isArray(modelItemMap)) {
                modelItemMap = modelItemMap.reduce((pre, cur) => (pre[cur.label] = cur.value, pre), {})
              }
              let mapLabel = modelItem[0] + 'Map';
              !renderData[mapLabel] && (renderData[mapLabel] = modelItemMap)
              modelItem[1].map = mapLabel
            }
          }
          pre.push(modelItem)
          return pre;
        }, [])
      },
      setPageCode() {
        fs.readFile(path.resolve(__static, `template/${this.template.type}Template.ejs`), (err, data) => {
          if (err) {
            console.error(err);
            return;
          }
          let model = ''
          try {
            model = JSON.parse(this.mirrorJson.getValue())
          } catch(e) {
            model = eval('(' + this.mirrorJson.getValue() +')')
          }
          let renderData = {}
          
          model.form && (model.form = this.formatData(model.form, renderData))
          model.table && (model.table = this.formatData(model.table, renderData))
          model.data = renderData
          if (model.form == null || model.table == null) {
            this.mirrorPage.setValue('')
          } else {
            this.mirrorPage.setValue(ejs.render(data.toString(), { config: model},))
          }
        })
      },
      handleChangeMirror() {
        let that = this
        return function(codeMirror, changes) {
          if (mirrorTimer) clearTimeout(mirrorTimer);
          mirrorTimer = setTimeout(() => {
            mirrorTimer = null
            that.setPageCode()
          }, 1000);
        }
      },
      handleCopy() {
        let text = this.mirrorPage.getValue()
        if(text == '') return;
        let input = document.createElement('textarea')
        input.value = text
        input.id = 'inputId'
        document.body.appendChild(input)
        let inputDom = document.querySelector('#inputId')
        inputDom.select();
        document.execCommand('copy')
        document.body.removeChild(input)
        alert('复制成功')
      },
      handleChangeTemplate(val) {
        console.log(this.template.type)
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  .wrapper {
    padding: 20px;
  }
  .mirror-title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
    text-align: center;
  }
  .mirror-x {
    display: flex;
  }
  .generate-x {
    text-align: right;
    margin-top: 2px;
  }
  .CodeMirror {
    border: 1px solid #ccc !important;
  }
  .CodeMirror-focused {
    box-shadow: inset 0 2px 2px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
  }
  .mirror-btn {
    line-height: 1.499;
    position: relative;
    display: inline-block;
    font-weight: 400;
    white-space: nowrap;
    text-align: center;
    background-image: none;
    border: 1px solid transparent;
    -webkit-box-shadow: 0 2px 0 rgba(0,0,0,0.015);
    box-shadow: 0 2px 0 rgba(0,0,0,0.015);
    cursor: pointer;
    -webkit-transition: all .3s cubic-bezier(.645, .045, .355, 1);
    transition: all .3s cubic-bezier(.645, .045, .355, 1);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    height: 32px;
    padding: 0 15px;
    font-size: 14px;
    border-radius: 4px;
    color: rgba(0,0,0,0.65);
    background-color: #fff;
    border-color: #d9d9d9;
}

.mirror-btn-primary {
  color: #fff;
  background-color: #1890ff;
  border-color: #1890ff;
  text-shadow: 0 -1px 0 rgba(0,0,0,0.12);
  -webkit-box-shadow: 0 2px 0 rgba(0,0,0,0.045);
  box-shadow: 0 2px 0 rgba(0,0,0,0.045);
}
.mirror-btn-red {
  color: #fff;
  background-color: #FF5A44;
  border-color: #FF5A44;
  text-shadow: 0 -1px 0 rgba(0,0,0,0.12);
  -webkit-box-shadow: 0 2px 0 rgba(0,0,0,0.045);
  box-shadow: 0 2px 0 rgba(0,0,0,0.045);
}
:focus{
  outline: 0;
}
</style>
