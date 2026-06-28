<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const goodsId = Number(route.params.id)

const goodsList = [
  {
    id: 1001,
    name: '遮光床帘',
    price: 45,
    publisherId: 'stu_2025001',
    desc: '上铺加厚遮光床帘，九成新，宿舍自用，全套支架配件齐全',
    trade: '线下宿舍自提，也可校内顺路配送',
    detail: '使用半年左右，遮光效果好，安装配件完整，无破损污渍，性价比很高'
  },
  {
    id: 1002,
    name: '定妆散粉',
    price: 32,
    publisherId: 'stu_2025002',
    desc: '大牌控油散粉，余量大半盒，油皮持妆好用，个人保真闲置转出',
    trade: '线下宿舍自提',
    detail: '控油磨皮效果优秀，适合混油、油皮，自用正品，保质期充足'
  },
  {
    id: 1003,
    name: '四色大地眼影盘',
    price: 28,
    publisherId: 'stu_2025003',
    desc: '日常百搭色系，几乎全新，新手好上手，消肿日常妆都合适',
    trade: '线下宿舍自提',
    detail: '哑光+微闪搭配，通勤、日常妆百搭，几乎没怎么使用'
  },
  {
    id: 1004,
    name: '哑光修容盘',
    price: 25,
    publisherId: 'stu_2025001',
    desc: '脸部阴影修容，用量很少，修饰轮廓自然，粉质细腻不结块',
    trade: '线下宿舍自提',
    detail: '灰调适合亚洲肤色，不显脏，修饰下颌线、鼻梁很自然'
  },
  {
    id: 1005,
    name: '加厚塑料洗脸盆',
    price: 8,
    publisherId: 'stu_2025004',
    desc: '大号洗衣洗脸两用盆，无开裂破损，搬家闲置便宜出',
    trade: '线下宿舍自提',
    detail: '加厚材质结实耐用，可洗衣服、泡脚、洗脸，闲置低价处理'
  },
  {
    id: 1006,
    name: '落地折叠晾衣架',
    price: 35,
    publisherId: 'stu_2025002',
    desc: '可伸缩落地衣架，晒衣服被子稳固不晃，宿舍租房很实用',
    trade: '线下宿舍自提',
    detail: '可折叠不占空间，承重强，晾晒衣物、被褥都很方便'
  }
]

const currentGoods = goodsList.find(item => item.id === goodsId)
</script>

<template>
  <div class="page-wrap" v-if="currentGoods">
    <h1 class="page-title">商品详情页</h1>
    <div class="detail-card">
      <div class="row-item">
        <span class="label">商品编号：</span>
        <span class="value">{{ currentGoods.id }}</span>
      </div>
      <div class="row-item">
        <span class="label">商品名称：</span>
        <span class="value">{{ currentGoods.name }}</span>
      </div>
      <div class="row-item">
        <span class="label">售价：</span>
        <span class="value price-text">¥{{ currentGoods.price }}</span>
      </div>
      <div class="row-item">
        <span class="label">发布人ID：</span>
        <span class="value">{{ currentGoods.publisherId }}</span>
      </div>
      <div class="row-item">
        <span class="label">交易方式：</span>
        <span class="value">{{ currentGoods.trade }}</span>
      </div>
      <div class="row-item">
        <span class="label">简短介绍：</span>
        <span class="value">{{ currentGoods.desc }}</span>
      </div>
      <div class="row-item">
        <span class="label">详细描述：</span>
        <span class="value">{{ currentGoods.detail }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-wrap {
  padding: 20px 0;
}
.page-title {
  font-size: 26px;
  color: #1f2937;
  margin-bottom: 24px;
  border-left: 5px solid #409eff;
  padding-left: 12px;
}
.detail-card {
  max-width: 600px;
  padding: 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.row-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f2f3f5;
}
.row-item:last-child {
  border-bottom: none;
}
.label {
  width: 110px;
  font-weight: 500;
  color: #303133;
}
.value {
  color: #606266;
}
.price-text {
  color: #f56c6c;
  font-weight: bold;
  font-size: 17px;
}
</style>
