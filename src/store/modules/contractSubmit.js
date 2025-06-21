// src/store/modules/contractSubmit.js

import { createContract } from '@/api/contract' // 假设你有对应的 API 文件

const state = {
  contract: {
    name: '',
    code: '',
    clientCompany: '',
    creditCode: '',
    payCycle: '',
    warrantyType: '',
    warrantyMethod: '',
    warrantyArea: 0,
    amount: 0,
    startDate: '',
    endDate: '',
    autoNotice: false,
    designCompany: '',
    debugCompany: '',
    checkCompany: '',
    note: '',
    fileUrls: [],
    maintenanceItems: [],
    maintainPersons: {
      leader: '',
      technical: '',
      maintainer: ''
    },
    buildings: [],
    projectInfo: {
      name: '',
      companyname: '',
      address: '',
      district: '',
      position: {
        lng: null,
        lat: null
      },
      ownerCompany: '',
      contactPerson: '',
      contactPhone: '',
      logoUrl: '',
      entranceReportUrl: '',
      members: {
        leader: '',
        technical: '',
        maintainers: []
      }
    }
  }
}

const mutations = {
  SET_CONTRACT_FIELD(state, { key, value }) {
    state.contract[key] = value
  },
  SET_CONTRACT_PROJECTINFO_FIELD(state, { key, value }) {
    state.contract.projectInfo[key] = value
  },
  SET_CONTRACT_MAINTAINPERSONS(state, value) {
    state.contract.maintainPersons = value
  },
  SET_CONTRACT_BUILDINGS(state, buildings) {
    state.contract.buildings = buildings
  },
  SET_CONTRACT_PROJECTINFO_MEMBERS(state, members) {
    state.contract.projectInfo.members = members
  },
  RESET_CONTRACT(state) {
    Object.assign(state.contract, {
      name: '', code: '', clientCompany: '', creditCode: '', payCycle: '',
      warrantyType: '', warrantyMethod: '', warrantyArea: 0, amount: 0,
      startDate: '', endDate: '', autoNotice: false,
      designCompany: '', debugCompany: '', checkCompany: '', note: '',
      fileUrls: [], maintenanceItems: [],
      maintainPersons: { leader: '', technical: '', maintainer: '' },
      buildings: [],
      projectInfo: {
        name: '', companyname: '', address: '', district: '',
        position: { lng: null, lat: null },
        ownerCompany: '', contactPerson: '', contactPhone: '',
        logoUrl: '', entranceReportUrl: '',
        members: { leader: '', technical: '', maintainers: [] }
      }
    })
  }
}

const actions = {
  updateContractField({ commit }, payload) {
    commit('SET_CONTRACT_FIELD', payload)
  },
  updateProjectInfoField({ commit }, payload) {
    commit('SET_CONTRACT_PROJECTINFO_FIELD', payload)
  },
  updateMaintainPersons({ commit }, value) {
    commit('SET_CONTRACT_MAINTAINPERSONS', value)
  },
  updateBuildings({ commit }, value) {
    commit('SET_CONTRACT_BUILDINGS', value)
  },
  updateProjectMembers({ commit }, value) {
    commit('SET_CONTRACT_PROJECTINFO_MEMBERS', value)
  },
  resetContract({ commit }) {
    commit('RESET_CONTRACT')
  },
  submitContract({ state }) {
    return createContract(state.contract) // 调用后端接口提交
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
