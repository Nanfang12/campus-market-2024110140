# Day5 Evidence - 状态管理与用户中心

## 1. 今日完成内容

今日围绕校园集市项目完成了基于 Pinia 的状态管理系统和用户中心页面开发。具体成果如下：

- **用户状态 Store（src/stores/user.ts）**：实现了当前用户信息的集中管理，包括姓名、学号、学院、专业、年级、个人描述 6 个字段，提供统一的资料更新方法，供导航栏、发布页面和个人中心共享。
- **收藏状态 Store（src/stores/favorite.ts）**：实现了跨页面的收藏列表管理，支持对 4 类信息（二手交易、失物招领、拼单搭子、跑腿委托）的统一收藏、取消收藏和状态查询，并提供 isFavorite 逻辑来避免重复收藏。
- **用户中心页面（src/views/UserCenterView.vue）**：完成了个人资料展示和编辑、我的收藏列表、我的发布列表三个核心模块，支持点击收藏项进入详情页、点击 🗑️ 按钮删除发布内容。
- **列表页收藏按钮集成**：在 TradeView、LostFoundView、GroupBuyView、ErrandView 中添加收藏按钮，点击后通过 favoriteStore 立即更新状态，并使用 `@click.stop.prevent` 阻止路由跳转干扰收藏操作。
- **页面间状态一致性验证**：在列表页点击收藏后，进入个人中心能立即看到新增收藏；取消收藏后，个人中心的收藏项立即消失，确保数据一致。

## 2. Store 设计说明

项目中设计了两个独立的 Pinia Store，分别负责不同领域的状态管理，避免状态混杂和维护困难。

| Store 文件 | 管理内容 | 主要状态 | 主要方法 |
|---|---|---|---|
| `src/stores/user.ts` | 当前用户信息 | `name`（姓名）、`studentId`（学号）、`college`（学院）、`major`（专业）、`grade`（年级）、`description`（个人描述）、`displayName` getter（显示名，用于匹配发布人） | `updateProfile()`（整体更新用户资料） |
| `src/stores/favorite.ts` | 收藏状态 | `favorites`（收藏项数组，每项包含 type/id/title/description/location）、`favoriteCount` getter | `isFavorite(type, id)`（查询是否已收藏）、`addFavorite(item)`（添加收藏）、`removeFavorite(type, id)`（移除收藏）、`toggleFavorite(item)`（切换收藏） |

设计要点说明：

1. **按领域拆分 Store**：用户信息和收藏数据属于完全不同的业务领域，拆成两个 Store 使各自的职责单一清晰，也方便后续分别扩展。
2. **统一 ID 比较逻辑**：由于后端 API 中 id 可能同时以 number 和 string 两种形式出现，favoriteStore 内部通过 `String(a) === String(b)` 的方式做比较，避免了"同一个条目因 id 类型不同被当作不同项"的问题。
3. **类型安全**：使用了 `FavoriteType`（'trade' \| 'lostFound' \| 'groupBuy' \| 'errand'）和 `FavoriteId`（number \| string）的联合类型，配合 TypeScript 类型检查，在调用处能提前发现参数错误。
4. **displayName getter 解耦**：userStore 中的 `displayName` 作为 getter 返回 `name || '当前用户'`，对外只暴露一个统一的显示名字段，"我的发布"按此字段筛选发布数据，即使后续字段名调整也不影响各业务页面的筛选逻辑。

## 3. 状态边界说明

状态边界设计的核心原则是：**是否有跨页面共享需求**。有共享需求的数据放入 Pinia Store，仅单页使用的临时数据放在组件本地 ref。

### 放入 Store 的数据

- **当前用户信息**（src/stores/user.ts）：导航栏 AppHeader.vue 要显示用户名、发布页 PublishView.vue 要把用户作为默认发布人、个人中心 UserCenterView.vue 要展示完整资料并允许编辑——**三处都要读/写，跨页面共享**，必须放入 Store。
- **收藏列表**（src/stores/favorite.ts）：4 个列表页（TradeView、LostFoundView、GroupBuyView、ErrandView）都有收藏按钮，需要实时显示当前收藏状态；个人中心还要汇总展示所有收藏——**跨 5 个以上页面共享**，必须放入 Store。

### 未放入 Store 的数据

- **各列表页的条目数据（trades/lostFounds/groupBuys/errands）**：它们只在当前列表页使用，从后端 API 拉取即可；不需要跨页面持久化，因此放在各组件的 `ref` 里即可，从后端拿数据比从 Store 读缓存更实时。
- **发布表单的临时输入内容**：只存在于 PublishView.vue 的输入框中，其他页面不关心，属于组件局部状态，直接用 ref 管理即可。
- **个人中心的临时编辑值（tempName/tempCollege 等）**：点击"编辑资料"后用户输入的中间值，点击"取消"应该回到原值，因此放在 UserCenterView.vue 的本地 ref 中，点击保存才调用 `updateProfile()` 回写到 Store——这是一个经典的"编辑态本地缓存"模式。
- **收藏项的 emoji/label 映射**：`getTypeEmoji()` 和 `getTypeLabel()` 只是纯函数，依赖的是纯静态映射表，不需要响应式，没必要占 Store 空间。
- **分页参数**：每个列表页自己的分页状态只服务该页面，不跨页共享，留在组件本地。

### 边界总结

Pinia Store 只承担**共享状态**的角色。判断"是否该放 Store"可以用一个简单标准：**有两个以上独立页面读取它，就放 Store**；只有一个页面用它，就放组件本地。这样既保证了跨页一致性，又避免 Store 过于臃肿、难以维护。

## 4. 页面使用记录

两个 Store 被以下页面或组件使用：

| 页面 / 组件 | 使用的 Store | 具体用途 |
|---|---|---|
| `src/components/AppHeader.vue` | userStore | 显示当前用户名称，作为登录态标识 |
| `src/views/PublishView.vue` | userStore | 将 userStore.displayName 作为发布条目的默认发布人写入数据库 |
| `src/views/TradeView.vue` | favoriteStore | 每个条目右侧有收藏按钮，点击后通过 `favoriteStore.toggleFavorite()` 更新状态，并通过 `favoriteStore.isFavorite()` 判断按钮文字是否显示"已收藏" |
| `src/views/LostFoundView.vue` | favoriteStore | 同上，为失物招领条目添加收藏按钮 |
| `src/views/GroupBuyView.vue` | favoriteStore | 同上，为拼单搭子条目添加收藏按钮 |
| `src/views/ErrandView.vue` | favoriteStore | 同上，为跑腿委托条目添加收藏按钮 |
| `src/views/UserCenterView.vue` | userStore + favoriteStore | 1) 用 userStore 展示用户资料、保存编辑后的资料；2) 用 `favoriteStore.favorites` 渲染"我的收藏"列表，并支持点击 ✕ 取消收藏；3) 用 userStore.displayName 作为过滤条件聚合"我的发布"列表，并支持点击 🗑️ 删除发布 |

## 5. AI 协作记录

### 使用的 AI 工具

- Trae IDE 内置 AI Assistant（基于 Doubao-Seed-2.0-Code）
- 辅助沟通平台：微信文字回传截图和报错信息

### 核心提示词与对话流

第一轮我对 AI 说的核心要求是：

> "给校园集市项目实现 Pinia 状态管理：需要一个用户 Store 和一个收藏 Store，并在导航栏、发布页、个人中心和四个列表页集成。个人中心要能展示用户资料、我的收藏和我的发布，要支持编辑资料和删除发布。"

后续随着问题出现，我又陆续给了更具体的提示词：

1. "收藏按钮点击后页面跳转到了详情页，收藏不了"
2. "只能收藏一个，收藏第二个后第一个自动取消收藏了"
3. "刷新页面后收藏数据丢失了"
4. "个人中心点开啥也没有，导航栏点哪个都空白"
5. "把个人信息处修改成姓名、学号、学院、专业、年级、个人描述 6 字段"
6. "UserCenterView.vue 第 89、208、237、247、257 行报 '已声明但从未读取其值' 的 ESLint 警告"

### AI 生成的内容

- Pinia Store 的初始代码（`defineStore` 结构、state/getters/actions 布局）
- 个人中心页面的完整 Vue 模板（包括编辑态 / 展示态切换、折叠列表、分页样式）
- 列表页收藏按钮的绑定方式（`@click.stop.prevent` 阻止默认行为）
- 类型定义（`FavoriteItem`、`FavoriteType`、`FavoriteId` 等）
- 错误修复建议（例如将 `fetch('/api/xxx')` 改成 `http.delete('/xxx')`）

### AI 生成内容中的不合理之处

1. **过度复杂的登录/鉴权系统**：AI 第一次生成 user.ts 时附带了完整的 JWT 登录逻辑、token 持久化、权限路由拦截——但这个项目其实没有后端登录系统，所有这些代码都是**完全用不上的噪音**。我不得不手动剥离掉 login/logout/token 相关代码，只保留最核心的资料字段。
2. **localStorage 持久化引起的副作用**：AI 在 userStore 和 favoriteStore 里主动加了 `loadFromStorage` / `saveToStorage`，使用 `localStorage` 做持久化。本意是好的，但它对解析异常保护不足，一旦浏览器中已有脏数据（如从其他页面遗留的 JSON），Pinia 初始化失败会导致**整个应用页面空白**——这就是我"点导航栏什么都没有"的根因。最后我选择**不持久化**，让 Store 完全基于内存状态，简单可靠。
3. **ID 类型混乱**：AI 最初写的 `isFavorite` 使用 `===` 严格比较 id，但 API 返回的 id 有时是 number 有时是 string，导致"看起来同一个条目却识别成两个"。我需要手动改成 `String(a) === String(b)` 的兼容写法。
4. **收藏按钮的路由冲突**：AI 只写了 `@click` 或 `@click.stop`，但收藏按钮包裹在 `<router-link>` 中，点击时会先触发路由跳转再触发收藏，导致"点了却收藏不上"。需要显式加 `@click.stop.prevent` 同时阻止冒泡和默认行为。
5. **ESLint 未使用变量警告**：AI 生成的完整代码中，有时定义了函数但模板里没正确引用（例如 `handleDelete`、`getTypeEmoji` 在脚本里写了，但模板里没渲染"我的发布"区块），导致 TypeScript/eslint 报 `6133 no-unused-vars`。需要确保模板和脚本保持一致。
6. **字段命名不统一**：早期 userStore 使用 `displayName` 和 `userDescription`，而个人中心又用了 `description`，AI 在不同位置混用，导致 "我的发布" 的筛选条件和数据库 publisher 字段不一致，出现"点开什么都没有"。最终统一成 `name` 字段 + `displayName` getter。

## 6. 人工调整内容

基于 AI 生成的初稿，我做了以下关键调整：

1. **删除了复杂的登录系统**：移除了 login/logout 方法、JWT token 处理、权限路由守卫，把 userStore 简化为只保存 6 个用户资料字段的轻量 Store。
2. **删除了 localStorage 持久化**：移除了 `loadFromStorage`、`saveToStorage` 以及 `STORAGE_KEY_*` 常量，让 Store 完全基于内存运行。页面刷新后数据丢失是可接受的（在原型阶段），但要保证页面不会因为 JSON 解析异常而全白。
3. **拆分了 userStore 和 favoriteStore**：AI 最初倾向于把所有状态塞进一个 store，我将其拆为 `user.ts`（用户资料）和 `favorite.ts`（收藏）两个独立 Store，职责更清晰、更方便后续维护。
4. **修正了 ID 比较逻辑**：将 `isFavorite` 的 `===` 比较改为 `String(a) === String(b)`，并在 favoriteStore 的其他方法（addFavorite/removeFavorite）中保持一致，避免 number/string 混用造成的识别错误。
5. **修复了列表页收藏按钮**：将 `@click` / `@click.stop` 统一改为 `@click.stop.prevent="favoriteStore.toggleFavorite(...)"`，阻止 `<router-link>` 的默认跳转。
6. **统一了用户姓名与数据库 publisher 的匹配**：将 userStore 的 `name` 默认值设置为 "当前用户"，并通过 `displayName` getter 暴露给筛选逻辑，确保"我的发布"能正确聚合以当前用户发布的条目。
7. **用户资料字段从 2 个扩展为 6 个**：把最初的 `displayName + userDescription` 两字段扩展为 `name、studentId、college、major、grade、description`，并在 UserCenterView.vue 中以 2 列 grid 的形式展示。
8. **完善了个人中心的"我的发布"聚合逻辑**：手动从 trades、lostFounds、groupBuys、errands 四个数据源按发布人筛选后合并，同时保留了 `type` 字段用于生成正确的详情页路由。
9. **实现了发布删除功能**：在 4 个 API 文件中分别添加了 `deleteTrade`、`deleteLostFound`、`deleteGroupBuy`、`deleteErrand` 方法，统一使用 `http.delete('/xxx/' + id)`，并在个人中心添加 🗑️ 删除按钮和确认弹窗。
10. **修正 ESLint 未使用变量警告**：确保 `EmptyState` 组件、`handleDelete`、`getDetailPath`、`getTypeLabel`、`getTypeEmoji` 在模板中都被实际引用，避免 IDE 持续报错干扰开发。

## 7. 测试记录

### 测试用例：跨页面收藏功能 + 个人中心数据一致性

**测试环境**：Windows 11、Chrome 浏览器、开发服务器（npm run dev），后端使用本地 json-server mock API。

**测试步骤**：

1. **启动项目**：在终端执行 `npm run dev`，等待开发服务器启动，浏览器自动打开 `http://localhost:5173/` 。
2. **进入"二手交易"页面**：点击顶部导航栏的"二手交易"链接，页面正常渲染出数条商品卡片，每条卡片右下角都有"☆ 收藏"按钮。
3. **点击第一个商品的收藏按钮**：按钮文字从 "☆ 收藏" 变为 "⭐ 已收藏"（样式从灰色变成橙色高亮）。此时观察 favoriteStore.favorites 数组长度为 1。
4. **点击第二个商品的收藏按钮**：同样从 "☆ 收藏" 变为 "⭐ 已收藏"，favoriteStore.favorites 长度变为 2。——**这个步骤验证了之前的 bug（"点第二个后第一个消失"）已经被修复**。
5. **再点一下第一个商品的收藏按钮**：按钮变回 "☆ 收藏"，favoriteStore.favorites 长度回到 1，toggle 逻辑正确。
6. **重新收藏第一个商品**：再次点收藏，favoriteStore.favorites 恢复到 2 项。
7. **切换到"失物招领"页面**：重复步骤 3，对 1 条失物招领信息点击收藏，favoriteStore.favorites 长度变为 3，且 type 字段正确识别为 'lostFound'。
8. **点击导航栏进入"个人中心"**：页面正常渲染。
   - 顶部资料卡显示：姓名"当前用户"、学号/学院/专业/年级显示"未设置"、个人描述显示"暂无个人描述"；
   - "我的收藏"区块显示 3 条收藏项（2 条二手交易 + 1 条失物招领），每条显示 emoji 图标、标题、描述、类型标签；
   - "我的发布"区块显示以"当前用户"为发布人的所有条目（包括之前在发布页发布的测试数据）。
9. **点击"我的收藏"中某一条的 ✕ 按钮**：该条目立即从列表中消失，favoriteStore.favorites 长度减 1。——**验证取消收藏的响应式更新正确**。
10. **点击"我的发布"中某一条的 🗑️ 按钮**：浏览器弹出确认对话框"确认删除《XXX》？删除后不可恢复。"，点击"确定"后，条目不显，同时页面中的发布项也从列表中消失——**验证了 delete API 调用成功且本地 ref 已更新**。
11. **回到"二手交易"页面**：刚才被删除的那条发布已经不在列表中——**验证删除真正作用到了后端数据，跨页面一致**。
12. **点击"编辑资料"按钮**：资料卡切换为编辑态，出现 6 个输入框。将姓名改为"李雷"、学院填"计算机学院"、专业填"软件工程"、年级填"2023级"，点击"保存修改"。——资料卡恢复展示态，内容变为新的值。
13. **验证发布人匹配变化**：回到发布页面，以"李雷"的身份新发布一条二手商品；然后回到个人中心，可以看到这条新发布的商品已出现在"我的发布"中。——**验证 userStore.name 变更后，displayName getter 和筛选逻辑正常工作**。

**测试结论**：Pinia 状态管理在 4 个列表页、1 个发布页、1 个导航栏组件、1 个个人中心页面之间实现了正确的状态共享，收藏、取消收藏、编辑资料、删除发布等操作均能实时响应，没有出现数据不一致或页面空白的问题。

## 8. 遇到的问题与解决方法

### 问题 1：点了收藏后页面直接跳详情页，收藏不了

**现象**：在 TradeView.vue 中，收藏按钮放在 `<router-link>` 内部的卡片上，点击"☆ 收藏"按钮，页面先跳转到了详情页，收藏操作根本没有被执行。

**原因分析**：`<router-link>` 会渲染成 `<a>` 标签，点击时触发默认路由跳转行为。即使按钮上加了 `@click.stop`，也只阻止了事件冒泡到父元素，**没有阻止 `<a>` 的默认跳转行为**。

**解决方法**：将按钮的事件处理改为 `@click.stop.prevent="favoriteStore.toggleFavorite(...)"`，其中 `.prevent` 修饰符显式调用 `event.preventDefault()`，阻止 `<a>` 标签的默认导航行为。4 个列表页统一做此修改。

### 问题 2：只能收藏一个，收藏第二个后第一个自动消失

**现象**：在列表页连续点 2 个不同条目的收藏，favoriteStore.favorites 始终只有 1 项。

**原因分析**：debug 发现 `isFavorite` 判断使用了 `===` 严格相等比较。API 返回的 id 有时是 number，有时是 string（后端 json-server 对不同的路由返回的类型不一致），导致"看起来是同一个条目但 id 类型不同"被识别成不同项，更严重的是，在 `removeFavorite` 中同样因类型不匹配无法移除旧项，最终呈现出"后一个覆盖前一个"的错觉。

**解决方法**：在 favoriteStore 中将所有 id 比较统一改为 `String(a) === String(b)` 的兼容写法。同时定义 `type FavoriteId = number | string` 类型，在 TypeScript 层面提示开发者"这个字段的类型不固定"。

### 问题 3：刷新页面后收藏数据丢失 / 用户资料重置

**现象**：收藏了 3 条后刷新浏览器，favoriteStore.favorites 变成了空数组；编辑过的用户名又变回了"当前用户"。

**原因分析**：Pinia 默认不做持久化，状态完全存在内存中，刷新即重置。

**第一次尝试的解决方法**：让 AI 添加了 localStorage 读写（`loadFromStorage` / `saveToStorage`），在 Store 初始化时从 localStorage 读取，在修改后写入 localStorage。

**该方案带来的新问题**：localStorage 的 JSON 解析缺乏异常保护，如果浏览器中已有脏数据（如其他页面遗留的、格式不完整的 JSON），`JSON.parse` 会抛出异常，导致 Pinia Store 初始化失败，进而影响整个页面渲染——表现为"点导航栏什么都没有"。

**最终解决方法**：**完全移除 localStorage 持久化**，让 Store 保持纯内存状态。在项目原型阶段，刷新后数据丢失是可以接受的代价，但页面不能因 JSON 解析异常而空白。后续如果有持久化需求，将使用更完善的持久化插件（如 pinia-plugin-persistedstate）做兜底。

### 问题 4：个人中心"我的发布"为空，什么都不显示

**现象**：进入个人中心，"我的发布"区块只有空状态文案。

**原因分析**：userStore 默认 `name` 字段为"校园集市用户"，而数据库里之前发布的条目 `publisher` 字段存的是"当前用户"，按 `item.publisher === userStore.displayName` 筛选时一个都匹配不上。

**解决方法**：把 userStore 的默认 name 改为"当前用户"，与数据库中已有发布条目的 publisher 一致；同时将 `displayName` 设为 getter 返回 `name || '当前用户'`，保证后续用户修改姓名后也能正确过滤。

### 问题 5：UserCenterView.vue 报大量 "已声明但从未读取其值" 警告

**现象**：IDE 中第 89、208、237、247、257 行持续有红色波浪线，对应的是 `EmptyState`、`handleDelete`、`getDetailPath`、`getTypeLabel`、`getTypeEmoji`。

**原因分析**：这些函数/组件只在 `<script>` 中被定义，但 `<template>` 里缺少相应的面板区块（如"我的收藏"和"我的发布"两个面板的模板代码），导致 TypeScript 和 eslint 认为它们从未被使用。

**解决方法**：补齐模板中的"我的收藏"和"我的发布"两个完整面板，确保每个声明的函数都在模板中被实际引用。替换了整份 UserCenterView.vue 文件，保持模板、脚本、样式三者一致。

### 问题 6：删除发布后，其他列表页数据未更新

**现象**：在个人中心点击 🗑️ 删除了某条发布，返回二手交易页面后，那条被删的商品还在列表中。

**原因分析**：delete API 最初使用的是 `fetch('/api/trades/' + id)` 直接调用，而不是项目中统一的 `http` 实例（应该配好 baseURL 和拦截器的那个），导致请求路径、鉴权或格式不一致，删除请求实际上并未成功。

**解决方法**：将 4 个 delete 方法统一改为 `http.delete('/trades/' + String(id))`，与项目已有的 get/post 方法使用相同的 http 实例和路径约定。删除成功后，在 `handleDelete` 中同步从本地 ref 数组中移除已删条目（响应式更新 UI），同时其他页面下次进入时重新从 API 拉取数据，确保数据一致性。

## 9. 今日反思

通过 Day5 的 Pinia 状态管理实践，我最深的体会是：**Pinia 是 Vue 3 多页面前端应用的"中央神经枢纽"**，它解决的核心问题是"跨页面 / 跨组件共享同一份响应式数据"。

在没有 Pinia 之前，如果我想在个人中心展示收藏，就不得不在每个列表页手动把收藏信息写进某个全局变量或 localStorage——但这样做既不响应式（数据变了 UI 不会自动刷新），也难以维护（每个页面都要写同样的读写逻辑）。有了 Pinia 之后，userStore 和 favoriteStore 成为单一真相来源（Single Source of Truth）：4 个列表页的收藏按钮、导航栏的用户名、发布页的默认发布人、个人中心的资料和发布列表，**都从同一个 Store 读取/写入**，一处修改，处处自动更新。

但实践中也发现了几个容易踩的坑。首先，**"该不该放进 Store"的判断需要非常克制**。我起初想把用户资料持久化到 localStorage，结果反而引发解析异常导致页面空白；真正持久化应该依赖后端数据库，Store 只应承担"会话内的状态共享"，不该过度承担存储职责。其次，**数据类型一致性是易被忽视的细节**：id 在 number 和 string 间摇摆，引发了"只能收藏一个"的诡异 bug，如果没有细致的 debug，很容易把锅甩给 Vue 或 Pinia 本身。再次，**AI 生成的代码永远要做人工裁剪**——AI 很容易生成"大而全"的解决方案（完整 JWT 登录、复杂持久化逻辑、多级权限），但原型项目只需要"小而准"的功能，过度设计反而增加出问题的概率，人工裁剪和边界约束是必不可少的。

经过今天的开发和调试，我对 Pinia 的核心价值有了更清晰的理解：它不只是一个数据存储容器，更是**一个让多个页面在运行时保持同步的契约系统**——每一个页面同意通过同一份 Store 读数据、写数据，这就是整个应用状态一致性的基础。未来在更复杂的多页面前端应用中，我会继续坚持按领域拆分 Store、保持状态边界清晰、对 AI 生成的代码做人工裁剪这三条原则，让状态管理成为生产力而不是负担。