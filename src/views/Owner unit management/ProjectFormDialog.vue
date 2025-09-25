<template>
  <el-form ref="projectForm" :model="form" label-width="110px" :rules="rules" style="padding-right:24px;">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="项目名称" prop="name" required>
          <el-input v-model="form.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目地址" prop="address">
          <div class="address-input-container">
            <el-autocomplete
            v-model="form.address"
              :fetch-suggestions="querySearchAsync"
            placeholder="请输入地址"
              class="address-input"
              @select="handleSelect"
              @input="onAddressInput"
              @blur="onAddressBlur"
              :debounce="300"
              value-key="value"
              :trigger-on-focus="false"
              :highlight-first-item="true"
            >
              <template slot-scope="{ item }">
                <div class="address-suggestion">
                  <div class="address-name" :title="item.name">{{ item.name }}</div>
                  <div class="address-detail" :title="item.address">{{ item.address }}</div>
                </div>
              </template>
            </el-autocomplete>
            <div class="address-buttons">
              <el-button 
                icon="el-icon-location" 
                @click="manualGeocode"
                :loading="geocoding"
                title="手动定位"
                type="primary"
                size="small"
              />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="项目定位" required>
          <div style="border:1px solid #e0e0e0; border-radius:6px; height:250px;width: 280px; margin-bottom:12px;overflow:hidden; position: relative;">
            <div id="mapContainer" style="width:100%; height:100%; background-color: #f5f7fa;" />
            <div v-if="!mapLoaded" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #f5f7fa; color: #999; font-size: 14px; text-align: center; padding: 20px;">
              <div>
                <div style="margin-bottom: 10px;">🗺️</div>
                <div>正在加载地图...</div>
                <div style="font-size: 12px; margin-top: 5px;">请稍候</div>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="项目区域" prop="area" required>
          <el-select v-model="form.area" placeholder="请选择区域" style="width:100%;" filterable>
            <el-option-group label="成都市">
              <el-option label="锦江区" value="锦江区" />
              <el-option label="青羊区" value="青羊区" />
              <el-option label="金牛区" value="金牛区" />
              <el-option label="武侯区" value="武侯区" />
              <el-option label="成华区" value="成华区" />
              <el-option label="龙泉驿区" value="龙泉驿区" />
              <el-option label="青白江区" value="青白江区" />
              <el-option label="新都区" value="新都区" />
              <el-option label="温江区" value="温江区" />
              <el-option label="双流区" value="双流区" />
              <el-option label="郫都区" value="郫都区" />
              <el-option label="新津区" value="新津区" />
              <el-option label="金堂县" value="金堂县" />
              <el-option label="大邑县" value="大邑县" />
              <el-option label="蒲江县" value="蒲江县" />
              <el-option label="都江堰市" value="都江堰市" />
              <el-option label="彭州市" value="彭州市" />
              <el-option label="邛崃市" value="邛崃市" />
              <el-option label="崇州市" value="崇州市" />
              <el-option label="简阳市" value="简阳市" />
            </el-option-group>
            <el-option-group label="南充市">
            <el-option label="顺庆区" value="顺庆区" />
            <el-option label="高坪区" value="高坪区" />
            <el-option label="嘉陵区" value="嘉陵区" />
              <el-option label="南部县" value="南部县" />
              <el-option label="营山县" value="营山县" />
              <el-option label="蓬安县" value="蓬安县" />
              <el-option label="仪陇县" value="仪陇县" />
              <el-option label="西充县" value="西充县" />
              <el-option label="阆中市" value="阆中市" />
            </el-option-group>
            <el-option-group label="自贡市">
              <el-option label="自流井区" value="自流井区" />
              <el-option label="贡井区" value="贡井区" />
              <el-option label="大安区" value="大安区" />
              <el-option label="沿滩区" value="沿滩区" />
              <el-option label="荣县" value="荣县" />
              <el-option label="富顺县" value="富顺县" />
            </el-option-group>
            <el-option-group label="攀枝花市">
              <el-option label="东区" value="东区" />
              <el-option label="西区" value="西区" />
              <el-option label="仁和区" value="仁和区" />
              <el-option label="米易县" value="米易县" />
              <el-option label="盐边县" value="盐边县" />
            </el-option-group>
            <el-option-group label="泸州市">
              <el-option label="江阳区" value="江阳区" />
              <el-option label="纳溪区" value="纳溪区" />
              <el-option label="龙马潭区" value="龙马潭区" />
              <el-option label="泸县" value="泸县" />
              <el-option label="合江县" value="合江县" />
              <el-option label="叙永县" value="叙永县" />
              <el-option label="古蔺县" value="古蔺县" />
            </el-option-group>
            <el-option-group label="德阳市">
              <el-option label="旌阳区" value="旌阳区" />
              <el-option label="罗江区" value="罗江区" />
              <el-option label="中江县" value="中江县" />
              <el-option label="广汉市" value="广汉市" />
              <el-option label="什邡市" value="什邡市" />
              <el-option label="绵竹市" value="绵竹市" />
            </el-option-group>
            <el-option-group label="绵阳市">
              <el-option label="涪城区" value="涪城区" />
              <el-option label="游仙区" value="游仙区" />
              <el-option label="安州区" value="安州区" />
              <el-option label="三台县" value="三台县" />
              <el-option label="盐亭县" value="盐亭县" />
              <el-option label="梓潼县" value="梓潼县" />
              <el-option label="北川羌族自治县" value="北川羌族自治县" />
              <el-option label="平武县" value="平武县" />
              <el-option label="江油市" value="江油市" />
            </el-option-group>
            <el-option-group label="广元市">
              <el-option label="利州区" value="利州区" />
              <el-option label="昭化区" value="昭化区" />
              <el-option label="朝天区" value="朝天区" />
              <el-option label="旺苍县" value="旺苍县" />
              <el-option label="青川县" value="青川县" />
              <el-option label="剑阁县" value="剑阁县" />
              <el-option label="苍溪县" value="苍溪县" />
            </el-option-group>
            <el-option-group label="遂宁市">
              <el-option label="船山区" value="船山区" />
              <el-option label="安居区" value="安居区" />
              <el-option label="蓬溪县" value="蓬溪县" />
              <el-option label="射洪市" value="射洪市" />
              <el-option label="大英县" value="大英县" />
            </el-option-group>
            <el-option-group label="内江市">
              <el-option label="市中区" value="市中区" />
              <el-option label="东兴区" value="东兴区" />
              <el-option label="威远县" value="威远县" />
              <el-option label="资中县" value="资中县" />
              <el-option label="隆昌市" value="隆昌市" />
            </el-option-group>
            <el-option-group label="乐山市">
              <el-option label="市中区" value="市中区" />
              <el-option label="沙湾区" value="沙湾区" />
              <el-option label="五通桥区" value="五通桥区" />
              <el-option label="金口河区" value="金口河区" />
              <el-option label="犍为县" value="犍为县" />
              <el-option label="井研县" value="井研县" />
              <el-option label="夹江县" value="夹江县" />
              <el-option label="沐川县" value="沐川县" />
              <el-option label="峨边彝族自治县" value="峨边彝族自治县" />
              <el-option label="马边彝族自治县" value="马边彝族自治县" />
              <el-option label="峨眉山市" value="峨眉山市" />
            </el-option-group>
            <el-option-group label="眉山市">
              <el-option label="东坡区" value="东坡区" />
              <el-option label="彭山区" value="彭山区" />
              <el-option label="仁寿县" value="仁寿县" />
              <el-option label="洪雅县" value="洪雅县" />
              <el-option label="丹棱县" value="丹棱县" />
              <el-option label="青神县" value="青神县" />
            </el-option-group>
            <el-option-group label="宜宾市">
              <el-option label="翠屏区" value="翠屏区" />
              <el-option label="南溪区" value="南溪区" />
              <el-option label="叙州区" value="叙州区" />
              <el-option label="江安县" value="江安县" />
              <el-option label="长宁县" value="长宁县" />
              <el-option label="高县" value="高县" />
              <el-option label="珙县" value="珙县" />
              <el-option label="筠连县" value="筠连县" />
              <el-option label="兴文县" value="兴文县" />
              <el-option label="屏山县" value="屏山县" />
            </el-option-group>
            <el-option-group label="广安市">
              <el-option label="广安区" value="广安区" />
              <el-option label="前锋区" value="前锋区" />
              <el-option label="岳池县" value="岳池县" />
              <el-option label="武胜县" value="武胜县" />
              <el-option label="邻水县" value="邻水县" />
              <el-option label="华蓥市" value="华蓥市" />
            </el-option-group>
            <el-option-group label="达州市">
              <el-option label="通川区" value="通川区" />
              <el-option label="达川区" value="达川区" />
              <el-option label="宣汉县" value="宣汉县" />
              <el-option label="开江县" value="开江县" />
              <el-option label="大竹县" value="大竹县" />
              <el-option label="渠县" value="渠县" />
              <el-option label="万源市" value="万源市" />
            </el-option-group>
            <el-option-group label="雅安市">
              <el-option label="雨城区" value="雨城区" />
              <el-option label="名山区" value="名山区" />
              <el-option label="荥经县" value="荥经县" />
              <el-option label="汉源县" value="汉源县" />
              <el-option label="石棉县" value="石棉县" />
              <el-option label="天全县" value="天全县" />
              <el-option label="芦山县" value="芦山县" />
              <el-option label="宝兴县" value="宝兴县" />
            </el-option-group>
            <el-option-group label="巴中市">
              <el-option label="巴州区" value="巴州区" />
              <el-option label="恩阳区" value="恩阳区" />
              <el-option label="通江县" value="通江县" />
              <el-option label="南江县" value="南江县" />
              <el-option label="平昌县" value="平昌县" />
            </el-option-group>
            <el-option-group label="资阳市">
              <el-option label="雁江区" value="雁江区" />
              <el-option label="安岳县" value="安岳县" />
              <el-option label="乐至县" value="乐至县" />
            </el-option-group>
            <el-option-group label="阿坝州">
              <el-option label="马尔康市" value="马尔康市" />
              <el-option label="汶川县" value="汶川县" />
              <el-option label="理县" value="理县" />
              <el-option label="茂县" value="茂县" />
              <el-option label="松潘县" value="松潘县" />
              <el-option label="九寨沟县" value="九寨沟县" />
              <el-option label="金川县" value="金川县" />
              <el-option label="小金县" value="小金县" />
              <el-option label="黑水县" value="黑水县" />
              <el-option label="壤塘县" value="壤塘县" />
              <el-option label="阿坝县" value="阿坝县" />
              <el-option label="若尔盖县" value="若尔盖县" />
              <el-option label="红原县" value="红原县" />
            </el-option-group>
            <el-option-group label="甘孜州">
              <el-option label="康定市" value="康定市" />
              <el-option label="泸定县" value="泸定县" />
              <el-option label="丹巴县" value="丹巴县" />
              <el-option label="九龙县" value="九龙县" />
              <el-option label="雅江县" value="雅江县" />
              <el-option label="道孚县" value="道孚县" />
              <el-option label="炉霍县" value="炉霍县" />
              <el-option label="甘孜县" value="甘孜县" />
              <el-option label="新龙县" value="新龙县" />
              <el-option label="德格县" value="德格县" />
              <el-option label="白玉县" value="白玉县" />
              <el-option label="石渠县" value="石渠县" />
              <el-option label="色达县" value="色达县" />
              <el-option label="理塘县" value="理塘县" />
              <el-option label="巴塘县" value="巴塘县" />
              <el-option label="乡城县" value="乡城县" />
              <el-option label="稻城县" value="稻城县" />
              <el-option label="得荣县" value="得荣县" />
            </el-option-group>
            <el-option-group label="凉山州">
              <el-option label="西昌市" value="西昌市" />
              <el-option label="木里藏族自治县" value="木里藏族自治县" />
              <el-option label="盐源县" value="盐源县" />
              <el-option label="德昌县" value="德昌县" />
              <el-option label="会理县" value="会理县" />
              <el-option label="会东县" value="会东县" />
              <el-option label="宁南县" value="宁南县" />
              <el-option label="普格县" value="普格县" />
              <el-option label="布拖县" value="布拖县" />
              <el-option label="金阳县" value="金阳县" />
              <el-option label="昭觉县" value="昭觉县" />
              <el-option label="喜德县" value="喜德县" />
              <el-option label="冕宁县" value="冕宁县" />
              <el-option label="越西县" value="越西县" />
              <el-option label="甘洛县" value="甘洛县" />
              <el-option label="美姑县" value="美姑县" />
              <el-option label="雷波县" value="雷波县" />
            </el-option-group>
            <el-option-group label="重庆市">
              <el-option label="渝中区" value="渝中区" />
              <el-option label="大渡口区" value="大渡口区" />
              <el-option label="江北区" value="江北区" />
              <el-option label="沙坪坝区" value="沙坪坝区" />
              <el-option label="九龙坡区" value="九龙坡区" />
              <el-option label="南岸区" value="南岸区" />
              <el-option label="北碚区" value="北碚区" />
              <el-option label="綦江区" value="綦江区" />
              <el-option label="大足区" value="大足区" />
              <el-option label="渝北区" value="渝北区" />
              <el-option label="巴南区" value="巴南区" />
              <el-option label="黔江区" value="黔江区" />
              <el-option label="长寿区" value="长寿区" />
              <el-option label="江津区" value="江津区" />
              <el-option label="合川区" value="合川区" />
              <el-option label="永川区" value="永川区" />
              <el-option label="南川区" value="南川区" />
              <el-option label="璧山区" value="璧山区" />
              <el-option label="铜梁区" value="铜梁区" />
              <el-option label="潼南区" value="潼南区" />
              <el-option label="荣昌区" value="荣昌区" />
              <el-option label="开州区" value="开州区" />
              <el-option label="梁平区" value="梁平区" />
              <el-option label="武隆区" value="武隆区" />
            </el-option-group>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="业主单位名称" prop="ownerName" required>
          <el-input v-model="form.ownerName" placeholder="请输入业主单位名称" />
        </el-form-item>
        <el-form-item label="项目单位联系人" prop="linkman" required>
          <el-input v-model="form.linkman" placeholder="请输入项目单位联系人姓名" />
        </el-form-item>
        <el-form-item label="联系人电话" prop="phone" required>
          <el-input v-model="form.phone" placeholder="请输入联系人电话" />
        </el-form-item>
        <el-form-item label="进场报告">
          <el-upload action="#" :show-file-list="false">
            <el-button size="mini" type="primary">+ 上传进场报告</el-button>
          </el-upload>
          <span class="upload-tips">上传支持: DOCX/PDF/PNG/JPG等格式</span>
        </el-form-item>
        <el-form-item label="项目/单位logo">
          <el-upload class="logo-uploader" action="#" :show-file-list="false">
            <i class="el-icon-camera logo-upload-icon" />
            <div class="el-upload__text">上传图片</div>
          </el-upload>
        </el-form-item>
      </el-col>
    </el-row>
    <div style="text-align:center; margin-top:10px;">
      <el-button type="primary" style="width:120px;" @click="onSave">保存</el-button>
      <el-button style="width:120px; margin-left:18px;" @click="$emit('cancel')">取消</el-button>
    </div>
  </el-form>
</template>

<script>
import MapDialog from './MapDialog.vue'

export default {
  name: 'ProjectFormDialog',
  props: {
    formData: Object
  },
  data() {
    return {
      mapDialogVisible: false,
      form: {
        name: '',
        address: '',
        area: '',
        ownerName: '',
        linkman: '',
        phone: '',
        location: { lng: null, lat: null }
      },
      map: null,
      marker: null,
      geocoder: null,
      placeSearch: null, // 地点搜索服务
      autoComplete: null, // 自动补全服务
      addressSuggestions: [], // 地址建议列表
      mapLoaded: false, // 地图是否已加载
      geocoding: false, // 是否正在地理编码
      rules: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        address: [{ required: true, message: '请输入项目地址', trigger: 'blur' }],
        area: [{ required: true, message: '请选择项目区域', trigger: 'change' }],
        ownerName: [{ required: true, message: '请输入业主单位名称', trigger: 'blur' }],
        linkman: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入电话', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    // 延迟加载地图，确保DOM已渲染
    this.$nextTick(() => {
      setTimeout(() => {
    this.loadMap()
      }, 100)
    })
    
    // 初始化表单数据
    this.initFormData()
  },
  watch: {
    formData: {
      handler(newVal) {
        this.initFormData()
      },
      immediate: true
    }
  },
  methods: {
    // 初始化表单数据
    initFormData() {
      if (this.formData) {
        // 如果有传入数据，使用传入的数据
        this.form = {
          name: this.formData.name || '',
          address: this.formData.address || '',
          area: this.formData.area || '',
          ownerName: this.formData.ownerName || '',
          linkman: this.formData.linkman || '',
          phone: this.formData.phone || '',
          location: this.formData.location || { lng: null, lat: null }
        }
        console.log('🔧 使用传入的表单数据:', this.form)
      } else {
        // 如果没有传入数据，重置为空白表单
        this.resetForm()
        console.log('🔧 重置为空白表单')
      }
    },
    
    // 重置表单
    resetForm() {
      this.form = {
        name: '',
        address: '',
        area: '',
        ownerName: '',
        linkman: '',
        phone: '',
        location: { lng: null, lat: null }
      }
      // 清除表单验证
      if (this.$refs.projectForm) {
        this.$refs.projectForm.clearValidate()
      }
    },
    
    // 加载高德地图 API
    loadMap() {
      console.log('开始加载地图...')
      
      // 检查是否已经加载了高德地图API
      if (window.AMap) {
        console.log('高德地图API已存在，直接初始化')
        this.initMap(window.AMap)
        return
      }
      
      // 检查AMapLoader是否存在
      if (!window.AMapLoader) {
        console.error('AMapLoader不存在，尝试动态加载')
        this.loadAMapScript()
        return
      }
      
      console.log('使用AMapLoader加载地图')
      window.AMapLoader.load({
        key: '9e88da7280b6a01c17010e78fdd66f1e', // 使用测试API key
        version: '1.4.15', // 使用稳定的版本
        plugins: ['AMap.Geocoder', 'AMap.PlaceSearch', 'AMap.Autocomplete', 'AMap.DistrictSearch', 'AMap.Geolocation'] // 使用正确的插件名称
      }).then(AMap => {
        console.log('地图API加载成功')
        console.log('AMap.Geocoder:', AMap.Geocoder)
        console.log('AMap.PlaceSearch:', AMap.PlaceSearch)
        console.log('AMap.Autocomplete:', AMap.Autocomplete)
        this.initMap(AMap)
      }).catch(e => {
        console.error('地图加载失败', e)
        this.showMapError()
      })
    },

    // 动态加载高德地图脚本
    loadAMapScript() {
      console.log('动态加载高德地图脚本')
      
      // 检查是否已经加载了脚本
      if (document.querySelector('script[src*="amap"]')) {
        console.log('高德地图脚本已存在，等待加载完成')
        this.waitForAMap()
        return
      }
      
      const script = document.createElement('script')
      script.src = 'https://webapi.amap.com/maps?v=1.4.15&key=9e88da7280b6a01c17010e78fdd66f1e&plugin=AMap.Geocoder,AMap.PlaceSearch,AMap.Autocomplete,AMap.DistrictSearch'
      script.onload = () => {
        console.log('高德地图脚本加载成功')
        this.waitForAMap()
      }
      script.onerror = () => {
        console.error('高德地图脚本加载失败')
        this.showMapError()
      }
      document.head.appendChild(script)
    },

    // 等待AMap对象可用
    waitForAMap() {
      let attempts = 0
      const maxAttempts = 50
      
      const checkAMap = () => {
        attempts++
        if (window.AMap) {
          console.log('AMap对象可用，初始化地图')
          this.initMap(window.AMap)
        } else if (attempts < maxAttempts) {
          setTimeout(checkAMap, 100)
        } else {
          console.error('等待AMap对象超时')
          this.showMapError()
        }
      }
      
      checkAMap()
    },

    // 显示地图错误信息
    showMapError() {
      const mapContainer = document.getElementById('mapContainer')
      if (mapContainer) {
        mapContainer.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 14px; text-align: center; padding: 20px;">
            <div>
              <div style="margin-bottom: 10px;">🗺️</div>
              <div>地图加载失败</div>
              <div style="font-size: 12px; margin-top: 5px;">请检查网络连接或刷新页面重试</div>
            </div>
          </div>
        `
      }
    },

    initMap(AMap) {
      console.log('开始初始化地图，AMap版本:', AMap.version)
      
      const mapContainer = document.getElementById('mapContainer')
      if (!mapContainer) {
        console.error('地图容器不存在')
        this.showMapError()
        return
      }
      
      console.log('地图容器找到，尺寸:', mapContainer.offsetWidth, 'x', mapContainer.offsetHeight)
      
      try {
      this.map = new AMap.Map('mapContainer', {
        zoom: 16,
          center: [106.1107, 30.8379], // 南充市中心坐标
          resizeEnable: true,
          mapStyle: 'amap://styles/normal'
        })
        
        console.log('地图初始化成功')
        
        // 等待地图加载完成
        this.map.on('complete', () => {
          console.log('地图加载完成')
          this.mapLoaded = true
          
          // 延迟初始化服务，确保AMap对象完全可用
          setTimeout(() => {
            this.initMapServices(AMap)
          }, 500)
        })
        
        // 地图加载失败处理
        this.map.on('error', (e) => {
          console.error('地图加载错误:', e)
          this.showMapError()
        })
        
      } catch (error) {
        console.error('地图初始化失败:', error)
        this.showMapError()
      }
    },

    // 初始化地图服务
    initMapServices(AMap) {
      console.log('开始初始化地图服务...')
      console.log('AMap对象:', AMap)
      console.log('AMap.Geocoder:', AMap.Geocoder)
      console.log('AMap.PlaceSearch:', AMap.PlaceSearch)
      console.log('AMap.AutoComplete:', AMap.AutoComplete)
      
      try {
        // 初始化地理编码服务
        if (AMap.Geocoder) {
          this.geocoder = new AMap.Geocoder({
            city: '全国', // 设置为全国，避免城市限制
            radius: 1000 // 搜索半径
          })
          console.log('✅ 地理编码服务初始化成功:', this.geocoder)
        } else {
          console.error('❌ AMap.Geocoder 不存在')
        }
        
        // 初始化地点搜索服务
        if (AMap.PlaceSearch) {
          this.placeSearch = new AMap.PlaceSearch({
            pageSize: 10,
            pageIndex: 1,
            city: '全国' // 设置为全国
          })
          console.log('✅ 地点搜索服务初始化成功:', this.placeSearch)
        } else {
          console.error('❌ AMap.PlaceSearch 不存在')
        }
        
        // 初始化自动补全服务
        if (AMap.Autocomplete) {
          this.autoComplete = new AMap.Autocomplete({
            city: '全国', // 设置为全国
            type: 'all', // 搜索所有类型的地点
            citylimit: false // 不限制城市
          })
          console.log('✅ 自动补全服务初始化成功:', this.autoComplete)
        } else {
          console.error('❌ AMap.Autocomplete 不存在')
        }

        // 添加地图点击事件
        this.map.on('click', (e) => {
          console.log('地图点击位置:', e.lnglat)
          this.setMarker(e.lnglat)
          this.reverseGeocode(e.lnglat)
        })
        
        console.log('✅ 地图点击事件绑定成功')

        // 如果有传入的数据，初始化表单
        if (this.formData) {
          this.initFormData()
        }
        
        // 显示服务初始化完成提示
        this.$message.success('地图服务初始化完成')
        
      } catch (error) {
        console.error('❌ 地图服务初始化失败:', error)
        // 地图服务初始化失败，不显示提示
      }
    },

    // 地址自动补全查询
    querySearchAsync(queryString, callback) {
      console.log('=== 地址自动补全查询开始 ===')
      console.log('查询字符串:', queryString)
      console.log('回调函数:', callback)
      
      if (!queryString) {
        console.log('查询字符串为空，返回空数组')
        callback([])
        return
      }
      
      console.log('正在搜索地址:', queryString)
      
      // 优先使用高德地图自动补全服务
      if (this.autoComplete) {
        console.log('使用高德地图自动补全服务')
        this.autoComplete.search(queryString, (status, result) => {
          console.log('高德地图自动补全搜索结果:', { status, result })
          
          if (status === 'complete' && result.tips && result.tips.length > 0) {
            const suggestions = result.tips.map(tip => {
              const suggestion = {
                value: tip.name,
                name: tip.name,
                address: (tip.district || '') + (tip.address || ''),
                location: tip.location,
                district: tip.district,
                adcode: tip.adcode,
                typecode: tip.typecode
              }
              
              console.log('处理高德地图建议项:', suggestion)
              return suggestion
            })
            
            console.log('高德地图地址建议列表:', suggestions)
            callback(suggestions)
          } else {
            console.log('高德地图自动补全搜索失败，尝试地点搜索:', status)
            this.searchPlacesForAutocomplete(queryString, callback)
          }
        })
      } else {
        console.log('高德地图自动补全服务不可用，尝试地点搜索')
        this.searchPlacesForAutocomplete(queryString, callback)
      }
    },

    // 使用地点搜索作为自动补全的备选方案
    searchPlacesForAutocomplete(queryString, callback) {
      if (!this.placeSearch) {
        console.log('地点搜索服务也不可用，尝试Web服务API')
        this.searchWithWebAPI(queryString, callback)
        return
      }
      
      console.log('使用地点搜索进行自动补全:', queryString)
      
      this.placeSearch.search(queryString, (status, result) => {
        console.log('地点搜索自动补全结果:', { status, result })
        
        if (status === 'complete' && result.poiList && result.poiList.pois && result.poiList.pois.length > 0) {
          const suggestions = result.poiList.pois.slice(0, 10).map(poi => ({
            value: poi.name,
            name: poi.name,
            address: poi.address,
            location: poi.location,
            district: poi.adname,
            adcode: poi.adcode,
            typecode: poi.typecode
          }))
          
          console.log('地点搜索建议列表:', suggestions)
          callback(suggestions)
        } else {
          console.log('地点搜索自动补全也失败，尝试Web服务API:', status)
          this.searchWithWebAPI(queryString, callback)
        }
      })
    },

    // 使用高德地图Web服务API进行地址搜索
    searchWithWebAPI(queryString, callback) {
      console.log('使用高德地图Web服务API搜索:', queryString)
      
      const apiKey = '9e88da7280b6a01c17010e78fdd66f1e'
      const url = `https://restapi.amap.com/v3/assistant/inputtips?key=${apiKey}&keywords=${encodeURIComponent(queryString)}&city=全国&output=json`
      
      fetch(url)
        .then(response => response.json())
        .then(data => {
          console.log('Web API搜索结果:', data)
          
          if (data.status === '1' && data.tips && data.tips.length > 0) {
            const suggestions = data.tips.map(tip => ({
              value: tip.name,
              name: tip.name,
              address: tip.district + tip.address,
              location: tip.location ? {
                lng: parseFloat(tip.location.split(',')[0]),
                lat: parseFloat(tip.location.split(',')[1])
              } : null,
              district: tip.district,
              adcode: tip.adcode,
              typecode: tip.typecode
            }))
            
            console.log('Web API建议列表:', suggestions)
            callback(suggestions)
          } else {
            console.log('Web API搜索失败，使用本地建议')
            this.getLocalAddressSuggestions(queryString, callback)
          }
        })
        .catch(error => {
          console.error('Web API请求失败:', error)
          console.log('Web API请求失败，使用本地建议')
          this.getLocalAddressSuggestions(queryString, callback)
        })
    },

    // 本地地址建议（备选方案）
    getLocalAddressSuggestions(queryString, callback) {
      console.log('使用本地地址建议:', queryString)
      
      // 扩展的地址建议列表
      const addressSuggestions = [
        // 四川省南充市
        { value: '四川省南充市顺庆区西华师范大学', name: '西华师范大学', address: '四川省南充市顺庆区西华师范大学', location: { lng: 106.1107, lat: 30.8379 }, district: '顺庆区' },
        { value: '四川省南充市顺庆区', name: '顺庆区', address: '四川省南充市顺庆区', location: { lng: 106.1107, lat: 30.8379 }, district: '顺庆区' },
        { value: '四川省南充市高坪区', name: '高坪区', address: '四川省南充市高坪区', location: { lng: 106.1189, lat: 30.7816 }, district: '高坪区' },
        { value: '四川省南充市嘉陵区', name: '嘉陵区', address: '四川省南充市嘉陵区', location: { lng: 106.0719, lat: 30.7629 }, district: '嘉陵区' },
        { value: '四川省南充市', name: '南充市', address: '四川省南充市', location: { lng: 106.1107, lat: 30.8379 }, district: '南充市' },
        
        // 重庆市
        { value: '重庆市北碚区天生路2号', name: '天生路2号', address: '重庆市北碚区天生路2号', location: { lng: 106.4344, lat: 29.8254 }, district: '北碚区' },
        { value: '重庆市北碚区', name: '北碚区', address: '重庆市北碚区', location: { lng: 106.4344, lat: 29.8254 }, district: '北碚区' },
        { value: '重庆市渝中区', name: '渝中区', address: '重庆市渝中区', location: { lng: 106.5516, lat: 29.5630 }, district: '渝中区' },
        { value: '重庆市江北区', name: '江北区', address: '重庆市江北区', location: { lng: 106.5382, lat: 29.5754 }, district: '江北区' },
        { value: '重庆市南岸区', name: '南岸区', address: '重庆市南岸区', location: { lng: 106.5606, lat: 29.5232 }, district: '南岸区' },
        { value: '重庆市沙坪坝区', name: '沙坪坝区', address: '重庆市沙坪坝区', location: { lng: 106.4572, lat: 29.5410 }, district: '沙坪坝区' },
        { value: '重庆市', name: '重庆市', address: '重庆市', location: { lng: 106.5516, lat: 29.5630 }, district: '重庆市' },
        
        // 四川省其他城市
        { value: '四川省成都市锦江区', name: '锦江区', address: '四川省成都市锦江区', location: { lng: 104.0805, lat: 30.6586 }, district: '锦江区' },
        { value: '四川省成都市青羊区', name: '青羊区', address: '四川省成都市青羊区', location: { lng: 104.0618, lat: 30.6744 }, district: '青羊区' },
        { value: '四川省成都市金牛区', name: '金牛区', address: '四川省成都市金牛区', location: { lng: 104.0431, lat: 30.6921 }, district: '金牛区' },
        { value: '四川省成都市武侯区', name: '武侯区', address: '四川省成都市武侯区', location: { lng: 104.0515, lat: 30.6300 }, district: '武侯区' },
        { value: '四川省成都市成华区', name: '成华区', address: '四川省成都市成华区', location: { lng: 104.1019, lat: 30.6603 }, district: '成华区' },
        { value: '四川省成都市', name: '成都市', address: '四川省成都市', location: { lng: 104.0668, lat: 30.5728 }, district: '成都市' },
        { value: '四川省绵阳市', name: '绵阳市', address: '四川省绵阳市', location: { lng: 104.6791, lat: 31.4675 }, district: '绵阳市' },
        { value: '四川省德阳市', name: '德阳市', address: '四川省德阳市', location: { lng: 104.3987, lat: 31.1269 }, district: '德阳市' },
        { value: '四川省宜宾市', name: '宜宾市', address: '四川省宜宾市', location: { lng: 104.6109, lat: 28.7602 }, district: '宜宾市' },
        { value: '四川省自贡市', name: '自贡市', address: '四川省自贡市', location: { lng: 104.7784, lat: 29.3390 }, district: '自贡市' },
        { value: '四川省泸州市', name: '泸州市', address: '四川省泸州市', location: { lng: 105.4433, lat: 28.8717 }, district: '泸州市' },
        { value: '四川省乐山市', name: '乐山市', address: '四川省乐山市', location: { lng: 103.7657, lat: 29.5521 }, district: '乐山市' },
        { value: '四川省达州市', name: '达州市', address: '四川省达州市', location: { lng: 107.5023, lat: 31.2096 }, district: '达州市' },
        { value: '四川省广安市', name: '广安市', address: '四川省广安市', location: { lng: 106.6334, lat: 30.4564 }, district: '广安市' },
        { value: '四川省遂宁市', name: '遂宁市', address: '四川省遂宁市', location: { lng: 105.5929, lat: 30.5328 }, district: '遂宁市' },
        { value: '四川省内江市', name: '内江市', address: '四川省内江市', location: { lng: 105.0584, lat: 29.5802 }, district: '内江市' },
        { value: '四川省资阳市', name: '资阳市', address: '四川省资阳市', location: { lng: 104.6419, lat: 30.1286 }, district: '资阳市' },
        { value: '四川省眉山市', name: '眉山市', address: '四川省眉山市', location: { lng: 103.8317, lat: 30.0483 }, district: '眉山市' },
        { value: '四川省雅安市', name: '雅安市', address: '四川省雅安市', location: { lng: 103.0010, lat: 29.9877 }, district: '雅安市' },
        { value: '四川省巴中市', name: '巴中市', address: '四川省巴中市', location: { lng: 106.7537, lat: 31.8588 }, district: '巴中市' },
        { value: '四川省广元市', name: '广元市', address: '四川省广元市', location: { lng: 105.8297, lat: 32.4354 }, district: '广元市' },
        { value: '四川省攀枝花市', name: '攀枝花市', address: '四川省攀枝花市', location: { lng: 101.7186, lat: 26.5823 }, district: '攀枝花市' },
        { value: '四川省凉山彝族自治州', name: '凉山彝族自治州', address: '四川省凉山彝族自治州', location: { lng: 102.2587, lat: 27.8867 }, district: '凉山彝族自治州' },
        { value: '四川省甘孜藏族自治州', name: '甘孜藏族自治州', address: '四川省甘孜藏族自治州', location: { lng: 101.9638, lat: 30.0507 }, district: '甘孜藏族自治州' },
        { value: '四川省阿坝藏族羌族自治州', name: '阿坝藏族羌族自治州', address: '四川省阿坝藏族羌族自治州', location: { lng: 102.2214, lat: 31.8994 }, district: '阿坝藏族羌族自治州' }
      ]
      
      // 根据输入内容过滤建议
      const filteredSuggestions = addressSuggestions.filter(item => 
        item.value.includes(queryString) || 
        item.name.includes(queryString) ||
        item.address.includes(queryString) ||
        item.district.includes(queryString)
      )
      
      console.log('过滤后的建议:', filteredSuggestions)
      callback(filteredSuggestions)
    },


    // 选择地址建议
    handleSelect(item) {
      console.log('选择地址建议:', item)
      
      // 更新地址
      this.form.address = item.value
      
      // 如果有位置信息，直接使用
      if (item.location && item.location.lng && item.location.lat) {
        console.log('使用建议中的位置信息:', item.location)
        this.form.location = { lng: item.location.lng, lat: item.location.lat }
        this.setMarker(item.location)
        this.map.setCenter(item.location)
        // 地址定位成功，不显示提示
      } else {
        // 如果没有位置信息，进行地理编码
        console.log('建议中没有位置信息，进行地理编码')
        this.geocodeAddress(item.value)
      }
      
      // 自动识别区域
      if (item.district) {
        this.autoDetectDistrict(item.district)
      } else {
        // 如果没有区域信息，从地址中提取
        this.autoDetectDistrict(item.value)
      }
    },

    // 地址输入处理
    onAddressInput(value) {
      console.log('地址输入事件触发:', value)
      
      if (!value) {
        // 清空地址时，清空地图标记和区域
        if (this.marker) {
          this.marker.setMap(null)
          this.marker = null
        }
        this.form.area = '' // 清空区域选择
        return
      }
      
      // 立即尝试自动识别区域
      this.autoDetectDistrict(value)
      
      // 延迟执行地理编码，避免频繁调用
      clearTimeout(this.geocodeTimer)
      this.geocodeTimer = setTimeout(() => {
        console.log('延迟执行地理编码:', value)
        this.geocodeAddress(value)
      }, 1000) // 增加延迟时间，避免频繁调用
    },

    // 强制显示地址建议
    forceShowSuggestions() {
      console.log('强制显示地址建议')
      const currentValue = this.form.address
      if (currentValue && currentValue.length > 0) {
        this.querySearchAsync(currentValue, (suggestions) => {
          console.log('强制显示建议结果:', suggestions)
          if (suggestions && suggestions.length > 0) {
            this.$message.info(`找到 ${suggestions.length} 个地址建议，请点击输入框查看`)
          }
        })
      }
    },

    // 地址输入框失焦处理
    onAddressBlur() {
      console.log('地址输入框失焦，当前地址:', this.form.address)
      
      if (this.form.address && this.form.address.trim()) {
        // 失焦时也触发区域自动识别
        this.autoDetectDistrict(this.form.address)
        
        // 失焦时也触发地理编码
        clearTimeout(this.geocodeTimer)
        this.geocodeTimer = setTimeout(() => {
          console.log('失焦触发地理编码:', this.form.address)
          this.geocodeAddress(this.form.address)
        }, 500)
      }
    },

    // 手动触发地理编码
    manualGeocode() {
      if (!this.form.address) {
        // 请先输入地址，不显示提示
        return
      }
      
      console.log('手动触发地理编码:', this.form.address)
      this.geocodeAddress(this.form.address)
    },

    // 测试地理编码功能
    testGeocode() {
      console.log('=== 测试地理编码功能 ===')
      console.log('当前地址:', this.form.address)
      console.log('地理编码服务:', this.geocoder)
      console.log('地图实例:', this.map)
      console.log('地图加载状态:', this.mapLoaded)
      console.log('自动补全服务:', this.autoComplete)
      console.log('地点搜索服务:', this.placeSearch)
      
      // 直接测试坐标映射功能
      console.log('直接测试坐标映射功能')
      this.useCoordinateMapping('重庆市北碚区天生路2号')
    },

    // 测试地址建议功能
    testAddressSuggestions() {
      console.log('=== 测试地址建议功能 ===')
      console.log('自动补全服务状态:', this.autoComplete)
      console.log('地点搜索服务状态:', this.placeSearch)
      
      // 测试地址建议
      const testQuery = '四川大学'
      console.log('测试查询:', testQuery)
      
      this.querySearchAsync(testQuery, (suggestions) => {
        console.log('地址建议测试结果:', suggestions)
        if (suggestions && suggestions.length > 0) {
          this.$message.success(`找到 ${suggestions.length} 个地址建议`)
          console.log('建议详情:', suggestions)
        } else {
          // 没有找到地址建议，不显示提示
        }
      })
    },

    // 地理编码地址
    geocodeAddress(address) {
      console.log('=== 开始地理编码 ===')
      console.log('输入地址:', address)
      console.log('地理编码服务状态:', !!this.geocoder)
      console.log('地图状态:', !!this.map)
      console.log('地图加载状态:', this.mapLoaded)
      
      if (!this.map) {
        console.error('地图未初始化')
        // 地图未初始化，不显示提示
        return
      }
      
      if (!this.mapLoaded) {
        console.error('地图未加载完成')
        // 地图正在加载中，不显示提示
        return
      }
      
      this.geocoding = true
      console.log('开始进行地理编码...', address)
      
      // 如果地理编码服务不可用，直接使用地点搜索
      if (!this.geocoder) {
        console.log('地理编码服务不可用，使用地点搜索作为备选方案')
        this.searchPlaceAsFallback(address)
        return
      }
      
      // 使用地理编码服务
      this.geocoder.getLocation(address, (status, result) => {
        this.geocoding = false
        console.log('地理编码结果:', { status, result })
        
        if (status === 'complete' && result.geocodes && result.geocodes.length > 0) {
          const geocode = result.geocodes[0]
          const point = geocode.location
          
          console.log('地理编码成功:', {
            address: geocode.formattedAddress,
            location: point,
            level: geocode.level
          })
          
          // 更新表单位置信息
            this.form.location = { lng: point.lng, lat: point.lat }
          
          // 设置地图标记
            this.setMarker(point)
          
          // 移动地图中心到新位置
          this.map.setCenter(point)
          
          // 自动识别区域
          if (geocode.formattedAddress) {
            this.autoDetectDistrict(geocode.formattedAddress)
          }
          
          // 显示成功提示
          // 地址定位成功，不显示提示
          
          } else {
          console.error('地理编码失败:', status, result)
          
          // 尝试使用地点搜索作为备选方案
          this.searchPlaceAsFallback(address)
        }
      })
    },

    // 备选方案：使用地点搜索
    searchPlaceAsFallback(address) {
      if (!this.placeSearch) {
        console.log('地点搜索服务未初始化')
        this.geocoding = false
        return
      }
      
      console.log('使用地点搜索作为备选方案:', address)
      
      this.placeSearch.search(address, (status, result) => {
        this.geocoding = false
        console.log('地点搜索结果:', { status, result })
        
        if (status === 'complete' && result.poiList && result.poiList.pois && result.poiList.pois.length > 0) {
          const poi = result.poiList.pois[0]
          const point = poi.location
          
          console.log('地点搜索成功:', {
            name: poi.name,
            address: poi.address,
            location: point
          })
          
          // 更新表单位置信息
          this.form.location = { lng: point.lng, lat: point.lat }
          
          // 设置地图标记
          this.setMarker(point)
          
          // 移动地图中心到新位置
          this.map.setCenter(point)
          
          // 自动识别区域
          if (poi.address) {
            this.autoDetectDistrict(poi.address)
          }
          
          // 显示成功提示
          // 地址定位成功，不显示提示
          
        } else {
          console.error('地点搜索也失败了:', status, result)
          // 尝试使用第三方地理编码服务作为最后的备选方案
          this.tryThirdPartyGeocoding(address)
        }
      })
    },

    // 第三方地理编码服务（备选方案）
    tryThirdPartyGeocoding(address) {
      console.log('尝试使用第三方地理编码服务:', address)
      
      // 使用百度地图的地理编码API作为备选
      const baiduGeocodingUrl = `https://api.map.baidu.com/geocoding/v2/?address=${encodeURIComponent(address)}&output=json&ak=YOUR_BAIDU_AK`
      
      // 或者使用腾讯地图的地理编码API
      const tencentGeocodingUrl = `https://apis.map.qq.com/ws/geocoder/v1/?address=${encodeURIComponent(address)}&key=YOUR_TENCENT_KEY`
      
      // 由于没有其他API Key，我们使用一个简单的坐标映射作为演示
      this.useCoordinateMapping(address)
    },

    // 使用坐标映射（演示用）
    useCoordinateMapping(address) {
      console.log('使用坐标映射:', address)
      
      // 一些常见地址的坐标映射
      const coordinateMap = {
        '重庆市北碚区天生路2号': { lng: 106.4344, lat: 29.8254 },
        '四川省南充市顺庆区西华师范大学': { lng: 106.1107, lat: 30.8379 },
        '四川省南充市': { lng: 106.1107, lat: 30.8379 },
        '重庆市': { lng: 106.5516, lat: 29.5630 },
        '重庆市北碚区': { lng: 106.4344, lat: 29.8254 },
        '电子科技大学': { lng: 104.0805, lat: 30.6586 },
        '电子科技大学(沙河校区)': { lng: 104.0805, lat: 30.6586 },
        '四川大学': { lng: 104.0805, lat: 30.6586 },
        '四川大学望江校区': { lng: 104.0805, lat: 30.6586 },
        '西南交通大学': { lng: 104.0431, lat: 30.6921 },
        '西南财经大学': { lng: 103.8317, lat: 30.0483 },
        '成都理工大学': { lng: 104.1019, lat: 30.6603 },
        '四川师范大学': { lng: 104.0805, lat: 30.6586 },
        '西华大学': { lng: 103.8317, lat: 30.0483 },
        '成都信息工程大学': { lng: 103.8317, lat: 30.0483 },
        '西南石油大学': { lng: 104.0805, lat: 30.6586 },
        '成都中医药大学': { lng: 103.8317, lat: 30.0483 },
        '四川农业大学': { lng: 103.8317, lat: 30.0483 },
        '西南民族大学': { lng: 104.0805, lat: 30.6586 },
        '成都大学': { lng: 104.0805, lat: 30.6586 },
        '四川音乐学院': { lng: 104.0805, lat: 30.6586 },
        '成都体育学院': { lng: 104.0805, lat: 30.6586 },
        '四川轻化工大学': { lng: 104.6234, lat: 28.7519 },
        '四川轻化工大学宜宾校区': { lng: 104.6234, lat: 28.7519 },
        '宜宾学院': { lng: 104.6234, lat: 28.7519 },
        '西华师范大学': { lng: 106.1107, lat: 30.8379 },
        '川北医学院': { lng: 106.1107, lat: 30.8379 },
        '西南科技大学': { lng: 104.6791, lat: 31.4675 },
        '绵阳师范学院': { lng: 104.6791, lat: 31.4675 },
        '四川文理学院': { lng: 107.5023, lat: 31.2096 },
        '乐山师范学院': { lng: 103.7657, lat: 29.5521 },
        '内江师范学院': { lng: 105.0584, lat: 29.5805 },
        '四川警察学院': { lng: 105.4439, lat: 28.8717 },
        '成都师范学院': { lng: 103.8317, lat: 30.0483 },
        '四川旅游学院': { lng: 104.0805, lat: 30.6586 },
        '成都工业学院': { lng: 103.8317, lat: 30.0483 },
        '四川民族学院': { lng: 101.9632, lat: 30.0504 },
        '阿坝师范学院': { lng: 103.5807, lat: 31.4746 }
      }
      
      // 查找匹配的坐标
      let matchedCoordinate = null
      for (const [key, coord] of Object.entries(coordinateMap)) {
        if (address.includes(key)) {
          matchedCoordinate = coord
          break
        }
      }
      
      if (matchedCoordinate) {
        console.log('找到匹配的坐标:', matchedCoordinate)
        
        // 确保坐标格式正确
        const position = [matchedCoordinate.lng, matchedCoordinate.lat]
        console.log('格式化后的坐标:', position)
        
        // 更新表单位置信息
        this.form.location = matchedCoordinate
        
        // 设置地图标记
        this.setMarker(position)
        
        // 移动地图中心到新位置
        this.map.setCenter(position)
        
        // 显示成功提示
        // 地址定位成功（使用坐标映射），不显示提示
        
        // 自动识别区域
        this.autoDetectDistrict(address)
      } else {
        console.error('无法找到匹配的坐标')
        // 无法定位该地址，不显示提示
      }
    },

    // 设置标记并回填地址
    setMarker(position) {
      if (!this.map) return

      console.log('设置地图标记，位置:', position)

      // 清除旧的标注
      if (this.marker) {
        this.marker.setMap(null)
        this.marker = null
      }

      try {
        // 确保位置格式正确
        let markerPosition
        if (Array.isArray(position)) {
          markerPosition = position
        } else if (position && position.lng && position.lat) {
          markerPosition = [position.lng, position.lat]
        } else {
          console.error('无效的位置格式:', position)
          return
        }

        console.log('创建标记，位置:', markerPosition)

      this.marker = new AMap.Marker({
          position: markerPosition,
        map: this.map
      })

        this.map.setCenter(markerPosition)
        console.log('标记设置成功')
      } catch (error) {
        console.error('设置标记失败:', error)
      }
    },

    // 逆地理编码
    reverseGeocode(position) {
      if (!this.geocoder) return
      
      this.geocoder.getAddress(position, (status, result) => {
        if (status === 'complete' && result.regeocode) {
          const address = result.regeocode.formattedAddress
          console.log('逆地理编码结果:', address)
          this.form.address = address
          
          // 自动识别区域
          this.autoDetectDistrict(address)
        } else {
          console.error('逆地址解析失败:', status)
        }
      })
    },

    // 自动识别区域
    autoDetectDistrict(address) {
      if (!address) return
      
      console.log('正在识别区域:', address)
      
      // 区域映射（四川省和重庆市所有区县）
      const districtMap = {
        // 成都市
        '锦江区': '锦江区', '青羊区': '青羊区', '金牛区': '金牛区', '武侯区': '武侯区', '成华区': '成华区',
        '龙泉驿区': '龙泉驿区', '青白江区': '青白江区', '新都区': '新都区', '温江区': '温江区', '双流区': '双流区',
        '郫都区': '郫都区', '新津区': '新津区', '金堂县': '金堂县', '大邑县': '大邑县', '蒲江县': '蒲江县',
        '都江堰市': '都江堰市', '彭州市': '彭州市', '邛崃市': '邛崃市', '崇州市': '崇州市', '简阳市': '简阳市',
        
        // 自贡市
        '自流井区': '自流井区', '贡井区': '贡井区', '大安区': '大安区', '沿滩区': '沿滩区', '荣县': '荣县', '富顺县': '富顺县',
        
        // 攀枝花市
        '东区': '东区', '西区': '西区', '仁和区': '仁和区', '米易县': '米易县', '盐边县': '盐边县',
        
        // 泸州市
        '江阳区': '江阳区', '纳溪区': '纳溪区', '龙马潭区': '龙马潭区', '泸县': '泸县', '合江县': '合江县', '叙永县': '叙永县', '古蔺县': '古蔺县',
        
        // 德阳市
        '旌阳区': '旌阳区', '罗江区': '罗江区', '中江县': '中江县', '广汉市': '广汉市', '什邡市': '什邡市', '绵竹市': '绵竹市',
        
        // 绵阳市
        '涪城区': '涪城区', '游仙区': '游仙区', '安州区': '安州区', '三台县': '三台县', '盐亭县': '盐亭县', '梓潼县': '梓潼县',
        '北川羌族自治县': '北川羌族自治县', '平武县': '平武县', '江油市': '江油市',
        
        // 广元市
        '利州区': '利州区', '昭化区': '昭化区', '朝天区': '朝天区', '旺苍县': '旺苍县', '青川县': '青川县', '剑阁县': '剑阁县', '苍溪县': '苍溪县',
        
        // 遂宁市
        '船山区': '船山区', '安居区': '安居区', '蓬溪县': '蓬溪县', '射洪市': '射洪市', '大英县': '大英县',
        
        // 内江市
        '市中区': '市中区', '东兴区': '东兴区', '威远县': '威远县', '资中县': '资中县', '隆昌市': '隆昌市',
        
        // 乐山市
        '市中区': '市中区', '沙湾区': '沙湾区', '五通桥区': '五通桥区', '金口河区': '金口河区', '犍为县': '犍为县', '井研县': '井研县',
        '夹江县': '夹江县', '沐川县': '沐川县', '峨边彝族自治县': '峨边彝族自治县', '马边彝族自治县': '马边彝族自治县', '峨眉山市': '峨眉山市',
        
        // 南充市
        '顺庆区': '顺庆区', '高坪区': '高坪区', '嘉陵区': '嘉陵区', '南部县': '南部县', '营山县': '营山县',
        '蓬安县': '蓬安县', '仪陇县': '仪陇县', '西充县': '西充县', '阆中市': '阆中市',
        
        // 眉山市
        '东坡区': '东坡区', '彭山区': '彭山区', '仁寿县': '仁寿县', '洪雅县': '洪雅县', '丹棱县': '丹棱县', '青神县': '青神县',
        
        // 宜宾市
        '翠屏区': '翠屏区', '南溪区': '南溪区', '叙州区': '叙州区', '江安县': '江安县', '长宁县': '长宁县', '高县': '高县',
        '珙县': '珙县', '筠连县': '筠连县', '兴文县': '兴文县', '屏山县': '屏山县',
        
        // 广安市
        '广安区': '广安区', '前锋区': '前锋区', '岳池县': '岳池县', '武胜县': '武胜县', '邻水县': '邻水县', '华蓥市': '华蓥市',
        
        // 达州市
        '通川区': '通川区', '达川区': '达川区', '宣汉县': '宣汉县', '开江县': '开江县', '大竹县': '大竹县', '渠县': '渠县', '万源市': '万源市',
        
        // 雅安市
        '雨城区': '雨城区', '名山区': '名山区', '荥经县': '荥经县', '汉源县': '汉源县', '石棉县': '石棉县', '天全县': '天全县', '芦山县': '芦山县', '宝兴县': '宝兴县',
        
        // 巴中市
        '巴州区': '巴州区', '恩阳区': '恩阳区', '通江县': '通江县', '南江县': '南江县', '平昌县': '平昌县',
        
        // 资阳市
        '雁江区': '雁江区', '安岳县': '安岳县', '乐至县': '乐至县',
        
        // 阿坝州
        '马尔康市': '马尔康市', '汶川县': '汶川县', '理县': '理县', '茂县': '茂县', '松潘县': '松潘县', '九寨沟县': '九寨沟县',
        '金川县': '金川县', '小金县': '小金县', '黑水县': '黑水县', '壤塘县': '壤塘县', '阿坝县': '阿坝县', '若尔盖县': '若尔盖县', '红原县': '红原县',
        
        // 甘孜州
        '康定市': '康定市', '泸定县': '泸定县', '丹巴县': '丹巴县', '九龙县': '九龙县', '雅江县': '雅江县', '道孚县': '道孚县', '炉霍县': '炉霍县',
        '甘孜县': '甘孜县', '新龙县': '新龙县', '德格县': '德格县', '白玉县': '白玉县', '石渠县': '石渠县', '色达县': '色达县', '理塘县': '理塘县',
        '巴塘县': '巴塘县', '乡城县': '乡城县', '稻城县': '稻城县', '得荣县': '得荣县',
        
        // 凉山州
        '西昌市': '西昌市', '木里藏族自治县': '木里藏族自治县', '盐源县': '盐源县', '德昌县': '德昌县', '会理县': '会理县', '会东县': '会东县',
        '宁南县': '宁南县', '普格县': '普格县', '布拖县': '布拖县', '金阳县': '金阳县', '昭觉县': '昭觉县', '喜德县': '喜德县', '冕宁县': '冕宁县',
        '越西县': '越西县', '甘洛县': '甘洛县', '美姑县': '美姑县', '雷波县': '雷波县',
        
        // 重庆市
        '渝中区': '渝中区', '大渡口区': '大渡口区', '江北区': '江北区', '沙坪坝区': '沙坪坝区', '九龙坡区': '九龙坡区',
        '南岸区': '南岸区', '北碚区': '北碚区', '綦江区': '綦江区', '大足区': '大足区', '渝北区': '渝北区',
        '巴南区': '巴南区', '黔江区': '黔江区', '长寿区': '长寿区', '江津区': '江津区', '合川区': '合川区',
        '永川区': '永川区', '南川区': '南川区', '璧山区': '璧山区', '铜梁区': '铜梁区', '潼南区': '潼南区',
        '荣昌区': '荣昌区', '开州区': '开州区', '梁平区': '梁平区', '武隆区': '武隆区'
      }
      
      // 遍历区域映射，找到匹配的区域
      for (const [key, value] of Object.entries(districtMap)) {
        if (address.includes(key)) {
          this.form.area = value
          console.log('自动识别区域:', value)
          return
        }
      }
      
      // 如果没有找到匹配的区域，尝试从地址中提取
      if (address.includes('四川省')) {
        const parts = address.split('四川省')
        if (parts.length > 1) {
          const cityPart = parts[1].split('市')[0] + '市'
          if (districtMap[cityPart]) {
            this.form.area = districtMap[cityPart]
            console.log('从地址提取区域:', cityPart)
            return
          }
        }
      }
      
      // 特殊地址处理 - 根据学校名称推断区域
      const schoolDistrictMap = {
        '电子科技大学': '成华区',
        '四川大学': '武侯区',
        '西南交通大学': '金牛区',
        '西南财经大学': '温江区',
        '成都理工大学': '成华区',
        '四川师范大学': '锦江区',
        '西华大学': '郫都区',
        '成都信息工程大学': '双流区',
        '西南石油大学': '新都区',
        '成都中医药大学': '温江区',
        '四川农业大学': '温江区',
        '西南民族大学': '武侯区',
        '成都大学': '龙泉驿区',
        '四川音乐学院': '武侯区',
        '成都体育学院': '武侯区',
        '四川传媒学院': '郫都区',
        '成都东软学院': '都江堰市',
        '四川工商学院': '郫都区',
        '成都文理学院': '金堂县',
        '四川外国语大学成都学院': '都江堰市',
        '四川轻化工大学': '翠屏区',
        '四川轻化工大学宜宾校区': '翠屏区',
        '宜宾学院': '翠屏区',
        '西华师范大学': '顺庆区',
        '川北医学院': '顺庆区',
        '西南科技大学': '涪城区',
        '绵阳师范学院': '涪城区',
        '四川文理学院': '通川区',
        '乐山师范学院': '市中区',
        '内江师范学院': '市中区',
        '四川警察学院': '江阳区',
        '成都师范学院': '温江区',
        '四川旅游学院': '龙泉驿区',
        '成都工业学院': '郫都区',
        '四川民族学院': '康定市',
        '阿坝师范学院': '汶川县',
        '四川工程职业技术学院': '旌阳区',
        '四川建筑职业技术学院': '旌阳区',
        '成都航空职业技术学院': '龙泉驿区',
        '四川交通职业技术学院': '温江区',
        '成都纺织高等专科学校': '郫都区',
        '四川电力职业技术学院': '青羊区',
        '成都职业技术学院': '高新区',
        '四川水利职业技术学院': '崇州市',
        '四川商务职业学院': '温江区',
        '四川艺术职业学院': '温江区',
        '四川文化产业职业学院': '华阳街道',
        '四川财经职业学院': '龙泉驿区',
        '四川邮电职业技术学院': '锦江区',
        '四川航天职业技术学院': '龙泉驿区',
        '四川化工职业技术学院': '纳溪区',
        '四川职业技术学院': '船山区',
        '四川信息职业技术学院': '利州区',
        '四川司法警官职业学院': '旌阳区',
        '四川管理职业学院': '温江区',
        '四川护理职业学院': '龙泉驿区',
        '四川卫生康复职业学院': '自流井区',
        '四川中医药高等专科学校': '涪城区',
        '四川幼儿师范高等专科学校': '江油市',
        '川北幼儿师范高等专科学校': '利州区',
        '四川商务职业学院': '温江区',
        '四川艺术职业学院': '温江区',
        '四川文化产业职业学院': '华阳街道',
        '四川财经职业学院': '龙泉驿区',
        '四川邮电职业技术学院': '锦江区',
        '四川航天职业技术学院': '龙泉驿区',
        '四川化工职业技术学院': '纳溪区',
        '四川职业技术学院': '船山区',
        '四川信息职业技术学院': '利州区',
        '四川司法警官职业学院': '旌阳区',
        '四川管理职业学院': '温江区',
        '四川护理职业学院': '龙泉驿区',
        '四川卫生康复职业学院': '自流井区',
        '四川中医药高等专科学校': '涪城区',
        '四川幼儿师范高等专科学校': '江油市',
        '川北幼儿师范高等专科学校': '利州区'
      }
      
      // 检查是否包含学校名称
      for (const [schoolName, district] of Object.entries(schoolDistrictMap)) {
        if (address.includes(schoolName)) {
          this.form.area = district
          console.log('根据学校名称识别区域:', schoolName, '->', district)
          return
        }
      }
      
      // 根据地址关键词推断区域
      const keywordDistrictMap = {
        '沙河': '成华区',
        '望江': '武侯区',
        '江安': '双流区',
        '华西': '武侯区',
        '九里': '金牛区',
        '犀浦': '郫都区',
        '温江': '温江区',
        '新都': '新都区',
        '龙泉': '龙泉驿区',
        '双流': '双流区',
        '郫都': '郫都区',
        '青白江': '青白江区',
        '都江堰': '都江堰市',
        '彭州': '彭州市',
        '邛崃': '邛崃市',
        '崇州': '崇州市',
        '简阳': '简阳市',
        '金堂': '金堂县',
        '大邑': '大邑县',
        '蒲江': '蒲江县',
        '新津': '新津区'
      }
      
      // 检查是否包含区域关键词
      for (const [keyword, district] of Object.entries(keywordDistrictMap)) {
        if (address.includes(keyword)) {
          this.form.area = district
          console.log('根据关键词识别区域:', keyword, '->', district)
          return
        }
      }
      
      console.log('未能自动识别区域，请手动选择')
    },

    // 初始化表单数据
    initFormData() {
      if (this.formData) {
        this.form = { ...this.formData }
        
        // 如果有位置信息，在地图上显示
        if (this.form.location && this.form.location.lng && this.form.location.lat) {
          this.$nextTick(() => {
            this.setMarker(this.form.location)
            this.map.setCenter(this.form.location)
          })
        }
      }
    },

    // 保存按钮
    onSave() {
      this.$refs.projectForm.validate(valid => {
        if (valid) {
          this.$emit('save', this.form)
        }
      })
    }
  }
}
</script>

<style scoped>
.map-preview {
  border:1px solid #e0e0e0;
  border-radius:6px;
  height:180px;
  margin-bottom:12px;
  overflow:hidden;
}
.map-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 14px;
  background-color: #f5f7fa;
}

.upload-tips {
  font-size: 13px;
  color: #888;
  margin-left: 8px;
}

/* 地址输入容器样式 */
.address-input-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.address-input {
  width: 100%;
}

/* 确保自动补全下拉框有足够宽度 */
.address-input .el-autocomplete-suggestion {
  min-width: 500px !important;
  max-width: 800px !important;
  width: auto !important;
}

.address-input .el-autocomplete-suggestion__wrap {
  max-height: 300px;
  overflow-y: auto;
  min-width: 500px;
}

/* 全局样式确保下拉框宽度 */
.el-autocomplete-suggestion {
  min-width: 500px !important;
  max-width: 800px !important;
}

.el-autocomplete-suggestion__wrap {
  min-width: 500px !important;
}

.address-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
}

.address-suggestion {
  padding: 10px 15px;
  min-width: 450px;
  max-width: 750px;
  white-space: normal;
  word-wrap: break-word;
  word-break: break-all;
  border-bottom: 1px solid #f0f0f0;
}

.address-suggestion:last-child {
  border-bottom: none;
}

.address-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.address-detail {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
  white-space: normal;
  word-wrap: break-word;
  word-break: break-all;
  max-width: 100%;
  display: block;
  min-height: 16px;
}
.logo-uploader {
  border: 2px dashed #d8e2f0;
  border-radius: 8px;
  width: 100px;
  height: 100px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 2px;
}
.logo-upload-icon {
  font-size: 28px;
  color: #b8c5db;
  margin-bottom: 4px;
}
</style>
