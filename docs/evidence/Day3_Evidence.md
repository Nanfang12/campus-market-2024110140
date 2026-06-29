# Day3 Evidence - Mock 数据建模与列表渲染

## 1. 今日完成内容
- 今天围绕校园轻集市项目，基于 JSON Server 搭建后端模拟环境，搭建并整理完整 Mock 数据 文件 db.json，划分四大业务数据集；在 src/api 目录封装 Axios 基础请求实例，再分别编写 trade.ts、lostFound.ts、groupBuy.ts、errand.ts 四个业务接口文件，实现四类数据请求方法；改造 ListView.vue、新建 LostFoundView.vue、GroupBuyView.vue、ErrandView.vue 四个列表页面，完成接口调用与列表渲染；创建通用空状态组件 EmptyState.vue，处理数据为空的展示场景；同步改造 DetailView.vue 实现根据路由 ID 查询单条商品详情，改造 BoardView.vue 完成数据统计看板动态取值，同时配置路由对应各个页面，完成 Day3 全部实训任务。

## 2. Mock 数据结构说明

| 数据集合 | 对应业务 | 主要字段 | 页面用途 |
|---|---|---|---|
| trades | 二手交易 | title、price、category、location、publisher、publishTime、condition、description、status | 展示二手商品列表，点击跳转详情页 |
| lostFounds | 失物招领 | title、type、itemName、location、eventTime、contact、status、description | 展示失物和招领信息，区分寻物 / 招领类型 |
| groupBuys | 拼单搭子 | title、type、targetCount、currentCount、deadline、location、publisher、status、description | 展示拼单进度、截止时间，直观显示还差人数 |
| errands | 跑腿委托 | title、taskType、reward、from、to、deadline、publisher、status、description | 展示跑腿起止地点、酬劳、截止时间 |

## 3. 我的设计

- 二手交易新增 price 价格、condition 成色字段：闲置商品核心信息就是售价与新旧程度，用户浏览时最关心价格和成色，同时搭配 publisher、publishTime 明确发布主体与时间，贴合校园二手交易真实场景。
- 失物招领设置 type 字段：用于区分 lost 寻物、found 招领两类业务，页面可以做文字差异化展示，方便同学快速分辨信息类型。
- 拼单搭子设置 targetCount 目标人数、currentCount 当前人数：用来实时展示拼单进度，直观体现还差多少人成团，搭配 deadline 截止时间控制拼单有效期。
- 跑腿委托设计 from 起点、to 终点、reward 酬劳：是跑腿订单最核心要素，明确取件、送达位置与对应报酬，满足代取快递、代买代办的业务逻辑。

## 4. AI 设计

- AI 协助生成初始版本 db.json 完整 Mock 数据，一次性生成四条业务多条示例数据，省去手动逐条编写的繁琐过程；
- AI 生成 http.ts Axios 基础封装代码，以及四个 api 业务文件的类型定义与请求函数模板；
- AI 生成列表页面基础模板、ItemCard 卡片组件、空状态组件 EmptyState.vue 基础代码，以及详情页基础结构；
- AI 最初生成的数据存在冗余字段，部分字段命名不符合项目统一规范，还存在 v-for 变量名书写错误、导入包混淆（ref/onMounted 错误从 vue-router 引入）、find 返回值类型不匹配等不合理代码，不能直接运行使用。

## 5. 最终调整

- 删除 AI 生成里冗余、页面用不到的多余字段，精简 db.json 结构，保证字段精简可用；
- 统一修正字段命名，对齐页面模板取值，避免前后字段名不一致导致渲染空白；
- 修改导入错误：将 onMounted、ref 从 vue 导入，useRoute 单独从 vue-router 导入，解决 TS 语法报错；
- 修复 DetailView.vue 中 find 返回 undefined 类型报错，使用空值合并运算符转为 null，适配变量类型定义；
- 修正列表 v-for 内部错误变量名，修复 key 与路由跳转取值错误；
- 在四个列表页面统一引入空状态组件，补充数组为空时的兜底展示逻辑，完善交互完整性。

## 6. 遇到的问题与解决方法

- 问题：改造 DetailView.vue 后 TS 持续报错，提示不能将 undefined 赋值给 TradeItem | null 类型。
- 原因：数组 find 方法找不到匹配 ID 数据时返回 undefined，而当前变量只允许接收对象或 null，类型不匹配触发校验报错。
- 解决方式：先接收 find 返回结果，通过 ?? 运算符判断，找不到数据时手动赋值为 null，保证类型兼容；同时模板使用 v-if 判断变量不为空再渲染内部内容，避免空对象取值报错，修改后页面可正常根据路由 ID 加载对应商品详情。

## 7. 今日反思

- Mock 数据建模、接口请求和列表渲染是前后端分离开发最基础的核心流程，Mock 数据可以在后端接口未开发完成时，模拟真实后端数据结构，方便前端独立开发调试页面；借助 JSON Server 可以快速搭建简易 REST 接口，低成本模拟增删改查网络请求；列表渲染则是绝大多数管理类、信息流页面的通用实现模式。熟练掌握整套流程后，不仅能快速完成页面数据展示、分页、空状态兜底等常规需求，也能帮我理解前后端数据交互逻辑，为后续对接真实后端接口、编写分页、筛选、提交新增等复杂业务打下扎实基础，养成规范的数据类型定义、接口分层封装的编码习惯。