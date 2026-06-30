# Day4 Evidence - 发布表单与数据新增

## 1. 今日完成内容

今日完成了校园轻集市平台的**统一发布页面**（`src/views/PublishView.vue`），集成了 4 种发布类型：二手交易、失物招领、拼单搭子、跑腿委托。每种发布类型均有专属字段、专属表单校验规则，通过顶部下拉选择器动态切换；提交后调用对应 `createXxx()` API 写入 localStorage，并通过 `pushMessage()` 生成一条系统消息通知，最后自动跳转到对应列表页。为配合发布功能，还在各业务 API 中补充了数据接口：`createTrade` / `createLostFound` / `createGroupBuy` / `createErrand`，以及统一的消息推送接口 `pushMessage`（`src/api/message.ts`）。

## 2. 发布类型与字段设计

| 发布类型 | 对应数据集合 | 关键字段 | 设计理由 |
|---|---|---|---|
| 二手交易 | trades（localStorage key: `campus_market_trades`） | title、category、price、condition、location、description | 校园二手交易的核心信息——商品名称、品类、价格、新旧程度、取货地点，缺一不可。"描述"补充成色与状态，让买家一眼能判断是否需要。 |
| 失物招领 | lostFounds（`campus_market_lostFounds`） | title、type、itemName、location、eventTime、description | "type" 用于区分"寻物"和"招领"，两类需求不同但信息结构相似，复用同一套字段；"eventTime" 记录物品遗失或被拾到的时间，便于匹配。 |
| 拼单搭子 | groupBuys（`campus_market_groupBuys`） | title、type、targetCount、deadline、location、description | 拼单最核心的两个维度：**目标人数**（必须 ≥2，否则不构成"拼"）与**截止时间**（拼单有强烈时效性）。类型字段方便分类（奶茶、教材、运动等）。 |
| 跑腿委托 | errands（`campus_market_errands`） | title、taskType、reward、from、to、deadline、description | 跑腿的本质是"从 A 到 B"，因此强制要求"取件地点 + 送达地点"两个字段；"酬劳"让任务更明确；"taskType" 便于浏览（取快递、代买、代送等）。 |

## 3. 表单校验规则

所有 4 种发布类型都设置了**通用字段校验**和**专属字段校验**两层规则，统一通过 `validateForm()` 函数实现：

**通用校验（所有类型共用）**
- `title`：调用 `.trim()` 后不能为空，否则提示"请输入标题"
- `location`：不能为空，否则提示"请输入地点"
- `description`：不能为空，否则提示"请输入描述"

**二手交易专属校验**
- `category`：不能为空，提示"请输入商品分类"
- `price`：必须 > 0（使用 `form.price || form.price <= 0` 双重判断，覆盖 0 和空值两种情况），提示"价格应大于 0"
- `condition`：必须选择，提示"请选择商品成色"

**失物招领专属校验**
- `itemName`：不能为空，提示"请输入物品名称"
- `eventTime`：必须选择日期时间，提示"请选择发生时间"

**拼单搭子专属校验**
- `groupType`：不能为空，提示"请输入拼单类型"
- `targetCount`：必须 ≥ 2（因为"拼"至少需要两个人），提示"目标人数不能少于 2 人"
- `deadline`：必须选择日期时间，提示"请选择截止时间"

**跑腿委托专属校验**
- `taskType`：不能为空，提示"请输入任务类型"
- `reward`：不能为负数（≥0 即可），提示"酬劳不能为负数"
- `from`：不能为空，提示"请输入取件地点"
- `to`：不能为空，提示"请输入送达地点"
- `deadline`：必须选择日期时间，提示"请选择截止时间"

整个校验逻辑采用 `reactive errors` 对象储存各字段的错误文本，字段旁边即时显示；只有在 `Object.values(errors).every(...)` 全部为空时才放行提交。

## 4. AI 协作记录

**使用的 AI 工具**：Doubao（字节跳动大模型，通过 Trae IDE 中的 Chat 入口调用）

**核心提示词（按时间顺序）**：
1. "帮我设计一个 Vue3 + TypeScript 的统一发布表单，支持二手交易、失物招领、拼单搭子、跑腿委托四种类型切换，类型切换后清空表单，并为每种类型设置专属字段和校验规则。字段命名用英文驼峰，数据写进 localStorage，不要依赖 JSON Server。"
2. "为 `parseImage` 函数增加 TypeScript 类型安全处理，`parts[0]` 不要报 `undefined` 错误。"
3. "AppHeader.vue 的消息按钮添加红点，根据消息数量显示数字角标；随后根据反馈，移除这个红点，保留消息入口即可。"
4. "修复一个严重 bug：失物招领、拼单搭子、跑腿委托点击详情后显示了二手交易的数据——排查多类型 ID 冲突。"
5. "整个站点主色换成淡橙色系，检查首页 Hero 区域、按钮、模块卡图标背景、阴影等颜色是否统一。"

**AI 生成的主要内容**：
- 整个 `PublishView.vue` 的结构框架：`reactive form` 对象统一存所有字段、`watch(publishType)` 监听类型切换清空数据、`validateForm()` 根据类型分支校验；
- 四个 `createTrade / createLostFound / createGroupBuy / createErrand` 函数的骨架代码；
- 首页 `HomeView.vue` 的 Hero 横幅、按钮、4 个模块卡片的初始布局（当时用蓝色系）；
- 导航栏的消息按钮红点样式（CSS `.badge` 类）；
- 首次尝试写 `DetailView.vue` 的数据查找逻辑。

**AI 生成内容的不合理之处**：
1. **多类型 ID 冲突严重**。AI 在 `DetailView.vue` 里对每个列表独立使用 `find(item => item.id === targetId)`，没有按 `route.meta.type` 过滤。由于每个列表的 id 都是从 1 开始自增，访问 `/lost-found/1` 时 `tradeItem`、`lostItem`、`groupItem`、`errandItem` 4 个引用同时找到数据，模板判断 `v-if="tradeItem"` 优先命中，所以永远显示二手交易的内容——这是本次 bug 排查的核心问题。
2. **主题色不统一**。AI 生成的首页里保留了 `module-blue / module-green / module-purple` 等多个颜色 class，与校园场景的温馨橙色不符，需要人工全局替换。
3. **数据持久化方式不稳定**。AI 最初倾向用 `fetch('http://localhost:3000/trades', { method: 'POST' })` 调 JSON Server，但本地开发环境没有持续跑 mock 服务，提交会报网络错误——改成 localStorage 更合适。
4. **发布后缺乏反馈**。AI 只做了"提交成功 → 跳转"，没有任何提示。需要额外加 `alert` 和系统消息两条反馈。
5. **消息按钮红点被用户明确拒绝**。AI 提供的红点视觉虽然常见，但在这个校园场景下过于"强调性"，用户反馈后需删除红点和相关的 `getMessages()` 计数逻辑。

## 5. 人工调整内容

1. **将数据持久化从 JSON Server 改为 localStorage**：在 `src/api/trade.ts`、`lostFound.ts`、`groupBuy.ts`、`errand.ts` 中分别实现 `readFromStorage` / `writeToStorage` 工具函数，`createXxx()` 不再发网络请求，而是读取本地数组 → push 新对象 → 重新写回。这样脱离 mock 服务也能运行。
2. **删除各页面的 `onMounted` 网络请求**：首页、列表页曾对 JSON Server 发起 `fetch`，失败后页面卡死、导航按钮无法点击。全部改为直接读取 localStorage。
3. **修复详情页 ID 冲突**：在 `DetailView.vue` 中给每个 `ref` 赋值前加 `itemType === 'xxx'` 的前置判断，确保 `/lost-found/:id` 只在 `lostFounds` 里查找；同时在模板 `v-if="tradeItem"` / `v-else-if="lostItem"` 等处补充 `itemType === 'xxx'` 条件，让渲染路由与类型严格绑定。
4. **修复 `parseImage` 的 TS 报错**：`parts[0]` 在 `parts.length === 0` 时为 `undefined`，`return [parts[0] || '📷', ...]` 增加兜底字符串，满足 TypeScript `[string, string]` 返回类型要求。
5. **主题色全局替换为淡橙色系**：主色 `#fb923c`，浅色 `#fff7ed`、`#fed7aa`、`#ffedd5`，深色文字 `#9a3412`、`#c2410c`；替换范围包括首页 Hero 背景、按钮渐变、4 个模块卡片图标背景、列表页卡片阴影、详情页样式等。
6. **增加发布成功反馈**：提交成功后弹出系统消息（`pushMessage`）到消息中心，同时弹一个简短 alert，再 `router.push` 到对应列表页，让用户的操作闭环清晰。
7. **移除消息按钮红点**：删除 `AppHeader.vue` 中的 `.badge` 元素和与之配套的 `getMessages()` 导入、`messageCount` 响应式变量；由于脚本块内已无代码，进一步删除整个 `<script setup>` 块，消除 `no-unused-vars` 的 ESLint 报错。
8. **统一 `datetime-local` 格式**：`<input type="datetime-local">` 的值是 `"2026-06-30T19:00"`，用 `formatTime()` 把 `T` 替换成空格，保持列表页与详情页的时间展示一致。
9. **发布类型切换清空数据**：用 `watch(publishType, () => resetForm())` 监听，避免在"二手交易 → 失物招领"时把价格、成色等无关字段残留带进新类型。

## 6. 测试记录

**测试场景：发布一条二手交易信息并验证全流程**

**测试步骤**：
1. 打开浏览器访问 `http://localhost:5173/publish`；
2. 顶部"发布类型"选择"二手交易"（默认就是此选项）；
3. 填写表单：标题 = "九成新台灯护眼灯"，地点 = "图书馆三楼自习区"，描述 = "因为要搬宿舍低价出，灯光明亮可三档调节，配件齐全"，分类 = "生活用品"，价格 = 45，成色 = "九成新"；
4. 点击"发布"按钮 → 浏览器弹窗提示"二手商品发布成功"；
5. 页面自动跳转到 `/trade`（二手交易列表页）；
6. 在列表页中滚动查找，确认新增卡片"九成新台灯护眼灯 ¥45"已出现在最前面；
7. 点击该卡片进入详情页（`/trade/7`，新的 id 为 7），确认标题、分类、价格、成色、地点、描述全部与填写内容一致；
8. 打开浏览器 DevTools → Application → Local Storage → `campus_market_trades`，看到新记录已被写入：`{ "id": 7, "title": "九成新台灯护眼灯", "category": "生活用品", "price": 45, "condition": "九成新", "location": "图书馆三楼自习区", ... }`；
9. 额外验证**负路径**：回到发布页，把价格改为 0，点击"发布" → 字段下方提示"价格应大于 0"，不提交；再把标题清空 → 提示"请输入标题"，表单拒绝提交。

**测试结果**：✅ 发布 → 提示 → 跳转 → 列表显示 → 详情 → localStorage 数据，整条链路通；负路径校验也按预期拦截。

## 7. 遇到的问题与解决方法

**问题 1：切换发布类型后字段残留**

- 现象：在"二手交易"里填了价格 45，切到"失物招领"再提交，新记录里多出了"price"字段。
- 原因：`form` 是一个统一的 `reactive` 对象，4 个类型的字段都存在里面；切换类型时没有清空字段。
- 解决：新增 `watch(publishType, () => resetForm())`，`resetForm()` 把所有字段重置为初始值（字符串为空，数字为 0 或 2），同时调用 `clearErrors()` 清空错误信息。

**问题 2：详情页显示错误类型的数据（最严重的 bug）**

- 现象：点击失物招领列表中的任一条目，详情页显示的是二手交易的内容。
- 根本原因：每个类型的 id 都是独立自增的，id=1 在 `trades`、`lostFounds`、`groupBuys`、`errands` 中都存在；`DetailView.vue` 里不加过滤地同时对 4 个列表做 `find(item.id === targetId)`，找到多个数据对象；模板使用 `v-if="tradeItem"` 优先级最高，所以永远渲染二手交易那一条。
- 解决：两步修复——(a) 在 `script` 里 `tradeItem.value = itemType === 'trade' ? ... : null`，其他类型同理，错误类型的 ref 直接为 `null`；(b) 在模板里把 `v-if="tradeItem"` 改成 `v-if="itemType === 'trade' && tradeItem"`，双重保险。修复后访问 `/lost-found/1`、`/group-buy/1`、`/errand/1` 均渲染正确类型内容。

**问题 3：`parseImage` 中 `parts[0]` 报 TypeScript 类型错误**

- 错误信息：`不能将类型 "string | undefined" 分配给类型 "string"`（ts-plugin(2322)）。
- 原因：函数签名声明返回值是 `[string, string]`，但 `img.split(' ')` 在空字符串时返回 `['']`，TS 仍会推断 `parts[0]` 可能为 `undefined`。
- 解决：把 `return [parts[0], parts.slice(1).join(' ')]` 改为 `return [parts[0] || '📷', parts.slice(1).join(' ')]`，用 `||` 提供非空的默认值。

**问题 4：TypeScript 报 `no-unused-vars` 与 computed 未使用**

- 现象：移除消息红点后，`import { onMounted, ref } from 'vue'` 整行被 ESLint 标红，提示"声明但从未使用"。
- 解决：既然脚本块已经完全空了，直接删除 `<script setup lang="ts">...</script>` 整个块——这是最干净的做法，避免以后新增逻辑时忘记重新引入。

**问题 5：JSON Server 未运行导致网络请求超时**

- 现象：列表页初次加载时调用 `fetch('/trades')`，本地 mock 服务没有启动，页面长时间挂起，导航栏按钮也不可点击（`onMounted` 中请求失败导致渲染中断）。
- 解决：全局移除对 JSON Server 的依赖——列表页、详情页、发布页全部改为从 `localStorage` 读/写数据，带 fallback 默认数据（首次访问会用 fallback 初始化 localStorage），后续新增内容从 `createXxx()` 写入。

## 8. 今日反思

**发布表单**是 Web 应用从"只读浏览"升级为"用户生产内容"的核心入口——没有发布表单，平台只能展示预置的示例数据，永远无法积累真实信息。在校园轻集市这样的场景中，发布表单还承担了"内容质量第一道防线"的角色：通过合理的字段设计，把学生的需求语言（"我要找人拼奶茶"）转化为结构化数据（title、type、targetCount、deadline、location、description），让后续的列表筛选、详情展示、搜索匹配等功能有了可计算的素材。

**表单校验**是发布表单不可缺少的伴侣。如果没有校验，用户可能会发布"标题为空、价格写 -10 元"的异常数据，这些脏数据会污染列表页，并让其他同学失去信任。我的设计思路是"通用 + 专属"两层：通用字段（标题、地点、描述）是所有类型都必需的，放在顶部统一校验；专属字段（二手交易的价格、拼单的目标人数、跑腿的取件/送达地点等）放在条件渲染的 `<template v-if="publishType==='xxx'">` 中，并在 `validateForm()` 内对应分支做专属规则判断。这样既避免了代码重复，又能让每种类型的约束都到位——例如"目标人数不能少于 2 人"就是拼单场景的专属业务规则，放在其他类型下毫无意义。

**数据新增**是"发布—校验—写入—展示"闭环中最关键的技术步骤。我最初也尝试了 JSON Server，但在本地环境不稳定的情况下，localStorage 是更轻量、零依赖的选择。数据写入采用"读 → 追加 → 写回"的标准模式：`getTrades()` 从 `localStorage` 读当前数组，新记录 push 进去（附带 auto-increment id、当前时间戳、当前用户），`writeToStorage()` 再 JSON 化写回。搭配发布后的系统消息推送（`pushMessage`），用户的发布行为会得到双重反馈——alert 即时提示 + 消息中心持久记录，形成良好的交互体验。整体而言，发布表单、表单校验和数据新增三者是一个不可拆分的功能单元，缺了任何一环，用户发布体验都会明显断裂。