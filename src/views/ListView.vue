<script setup lang="ts">
// 商品新增 price、publisherId 字段
const goodsList = [
  {
    id: 1001,
    name: '遮光床帘',
    price: 45,
    publisherId: 'stu_2025001',
    desc: '上铺加厚遮光床帘，九成新，宿舍自用，全套支架配件齐全'
  },
  {
    id: 1002,
    name: '定妆散粉',
    price: 32,
    publisherId: 'stu_2025002',
    desc: '大牌控油散粉，余量大半盒，油皮持妆好用，个人保真闲置转出'
  },
  {
    id: 1003,
    name: '四色大地眼影盘',
    price: 28,
    publisherId: 'stu_2025003',
    desc: '日常百搭色系，几乎全新，新手好上手，消肿日常妆都合适'
  },
  {
    id: 1004,
    name: '哑光修容盘',
    price: 25,
    publisherId: 'stu_2025001',
    desc: '脸部阴影修容，用量很少，修饰轮廓自然，粉质细腻不结块'
  },
  {
    id: 1005,
    name: '加厚塑料洗脸盆',
    price: 8,
    publisherId: 'stu_2025004',
    desc: '大号洗衣洗脸两用盆，无开裂破损，搬家闲置便宜出'
  },
  {
    id: 1006,
    name: '落地折叠晾衣架',
    price: 35,
    publisherId: 'stu_2025002',
    desc: '可伸缩落地衣架，晒衣服被子稳固不晃，宿舍租房很实用'
  }
]
</script>

<template>
  <div class="page-wrap">
    <h1 class="page-title">商品列表页</h1>
    <div class="goods-wrap">
      <div class="goods-card" v-for="item in goodsList" :key="item.id">
        <div class="goods-name">{{ item.name }}</div>
        <div class="goods-price">售价：¥{{ item.price }}</div>
        <div class="goods-pub">发布人ID：{{ item.publisherId }}</div>
        <div class="goods-desc">{{ item.desc }}</div>
        <div class="card-bottom">
          <router-link :to="`/detail/${item.id}`" class="detail-btn">查看详情</router-link>
        </div>
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
.goods-wrap {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}
.goods-card {
  width: 250px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 20px;
  transition: all 0.25s ease;
  background: #ffffff;
}
.goods-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 18px rgba(64, 158, 255, 0.16);
  border-color: #409eff;
}
.goods-name {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}
.goods-price {
  font-size: 16px;
  color: #f56c6c;
  font-weight: 500;
  margin-bottom: 6px;
}
.goods-pub {
  font-size: 13px;
  color: #909399;
  margin-bottom: 10px;
}
.goods-desc {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 20px;
}
.detail-btn {
  display: inline-block;
  padding: 7px 16px;
  background-color: #409eff;
  color: #fff;
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
}
.detail-btn:hover {
  background-color: #337ecc;
}
</style>
