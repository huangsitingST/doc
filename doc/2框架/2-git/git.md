# git

官方文档：https://git-scm.com/doc

## 一、工作流程

![image-20250422093404456](/Users/soup/Documents/2025年工作包/images/image-20250422093404456.png)

Untracked: git不知道的文件



## 二、使用步骤

### 1、用户信息

```bash
设置本地邮箱用户名

git config user.email --global '***'
git config user.name --global '***'

查看git配置
git config --list --global
```

![image-20250422105622926](/Users/soup/Documents/2025年工作包/images/image-20250422105622926.png)

​	本地配置的这个只是在push代码会带上的用户数据，标记是什么人提交的而已

![image-20250422105753229](/Users/soup/Documents/2025年工作包/images/image-20250422105753229.png)

### 2、链接远程仓库的两种··协议··

简单介绍可以看下CICD.md

#### 2.1如何配置

- https

  用户名+person_access_token

  ![image-20250422142056362](/Users/soup/Documents/2025年工作包/images/image-20250422142056362.png)

  第一次去推送代码需要设置用户名+token

  通过钥匙串访问app可以查到本地存储

  ![image-20250422162707212](/Users/soup/Documents/2025年工作包/images/image-20250422162707212.png)

- ssh协议

  配置方法可以查看CICD.md文件

#### 2.2一个实操：之前公司用的ssh，后来使用https去认证

网络安全相关

![image-20250422112723339](/Users/soup/Documents/2025年工作包/images/image-20250422112723339.png)

![image-20250422172448560](/Users/soup/Documents/2025年工作包/images/image-20250422172448560.png)

自己的轻量级服务器，通过22端口去连接服务器

配置80端口，设置nginx去访问文件

![image-20250422174809575](/Users/soup/Documents/2025年工作包/images/image-20250422174809575.png)

#### 2.3 实操关联的git的操作

切换链接源

![image-20250422142753060](/Users/soup/Documents/2025年工作包/images/image-20250422142753060.png)

这两个分别是两种连接的地址，如果需要切换连接方式，就是设置远程仓库地址

```bash
git remote -v
// 查看远程连接

git remote set-url origin **
// 设置远程地址
```

![image-20250422144145072](/Users/soup/Documents/2025年工作包/images/image-20250422144145072.png)

当前公司只支持https形式，我切换到ssh源，去push，报这个错，ssh默认是22端口号

![image-20250422144233514](/Users/soup/Documents/2025年工作包/images/image-20250422144233514.png)

切换回https源，成功

![image-20250422144452521](/Users/soup/Documents/2025年工作包/images/image-20250422144452521.png)

![image-20250422162208336](/Users/soup/Documents/2025年工作包/images/image-20250422162208336.png)

#### 2.4    ssh常见错误

- connection timed out 网络/防火墙问题
- connection refused ssh服务为运行或端口错误
- permission denied 认证错误

### 3、使用场景

#### 3.1 本地改了代码，add -》commit到本地仓库，公司的网总是延迟，发现远程有提交没有拉取。

##### 法一：撤销本地仓库代码到暂存区，拉代码，解决冲突，再提交

- git log：查看本地仓库的历史记录![image-20250422223238251](/Users/soup/Documents/2025年工作包/images/image-20250422223238251.png)

- git show [commit-hash]

  ![image-20250422223448879](/Users/soup/Documents/2025年工作包/images/image-20250422223448879.png)

- git reset HEAD~1  撤销本地仓库的提交且取消暂存

  ![image-20250422223813592](/Users/soup/Documents/2025年工作包/images/image-20250422223813592.png)

  HEAD～1：最近的一次提交

  git reset

  ​		--soft：撤销的提交保存到暂存区

  ​		--mixed：**默认**，撤销的提交直接到工作区

  ​		--hard：撤销的提交全部丢弃，暂存区和工作区均不保留

- git pull 拉取最新代码解决冲突再提交

##### 法二：强推，没有什么暴力解决不了的，但是得保证改的代码不会跟别人冲突，否则流水线失败

git push origin 分支名 --force

![image-20250422225536075](/Users/soup/Documents/2025年工作包/images/image-20250422225536075.png)

##### 法三：撤销这个提交

git revert [commit-id]

撤销某个提交，并生成新的提交

![image-20250423093413414](/Users/soup/Documents/2025年工作包/images/image-20250423093413414.png)

![image-20250423093553742](/Users/soup/Documents/2025年工作包/images/image-20250423093553742.png)



### 4、文档学习：2、git基础

#### 4.1 .git文件

是git版本控制系统的核心，存储了项目的所有版本信息和元数据

以爱学网项目为例

![image-20250423143501658](/Users/soup/Documents/2025年工作包/images/image-20250423143501658.png)

##### 1、refs

![image-20250423143914942](/Users/soup/Documents/2025年工作包/images/image-20250423143914942.png)

##### 2、config

![image-20250423144325617](/Users/soup/Documents/2025年工作包/images/image-20250423144325617.png)

存储仓库级配置信息，如用户信息、远程仓库 URL、别名等，优先级高于全局配置

##### 3、 Hook：钩子

在特定的git操作发生时**自动触发自定义脚本**，从而实现自动化任务或流程控制，在.git/hooks目录下

<img src="/Users/soup/Documents/2025年工作包/images/image-20250423141940832.png" alt="image-20250423141940832" style="zoom:50%;" />



pre-commit：提交前触发，常用于格式检查（eslint）或运行测试

pre-push：推送前触发，可验证代码兼容性或集成测试

pre-receive：服务器接受推送前触发

##### 4、index

记录暂存区的东西

#### 4.2 .gitnore 忽略文件

#### 4.3 命令

1-查看文件状态

##### git status

// 文件modified、unmodified、需要push、up to date

2-查看工作区和暂存区的区别

##### git diff

![image-20250423160752115](/Users/soup/Documents/2025年工作包/images/image-20250423160752115.png)

3-查看暂存区于本地仓库的区别

##### git diff staged

4-工作区代码 -> 本地仓库：跳过暂存区

##### git commit -a -m ''

5-查看最近两条提交记录

##### git log -2

6-把暂存区的东西提交到已有的本地仓库记录去

git commit -m 'add'  // 本地仓库以后已有

git add .						 // 工作区还有未提交的

##### git commit --amend   // 暂存区的东西再加入本地仓库中

#### 4.4 远程仓库

![image-20250424110021560](/Users/soup/Documents/2025年工作包/images/image-20250424110021560.png)

##### git remote

查看已经配置的远程仓库服务器，origin是git给克隆的仓库服务器的名字

git remote -v

##### git add remote gitee-soup https://gitee.com/readboy_soup/ai-learn-moblie-student.git

添加远程地址，取名为gitee-soup，一般不取名字的话就会默认是origin![image-20250424154853432](/Users/soup/Documents/2025年工作包/images/image-20250424154853432.png)

可以指定push的远程仓库

git push gitee-soup

##### git fetch gitee-soup

拉取指定仓库的信息：分支、log、tag...

##### git push origin

推送到指定远程仓库

##### git remote show origin 

查看某个远程仓库

![image-20250424170117005](/Users/soup/Documents/2025年工作包/images/image-20250424170117005.png)

##### git remote remove give-soup

移除远程仓库

#### 4.5 打标签

##### git tag

查看标签列表

##### git tag -a v1.0 -m '备注'

打1.0 tag且添加备注

##### git tag show v1.0

展示1.0tag的新增内容

##### git tag v1.1-light

打轻量级标签，不需要备注

##### git push orgin v1.0

推送标签

##### git push origin --tags

推送所有标签

##### git tag -d v1.0

删除标签

##### git push origin -- delete v1.0

删除远程标签

#### 4.6 分支

##### git branch test

创建新分支，HEAD指向当前所在的分支

![image-20250425094130242](/Users/soup/Documents/2025年工作包/images/image-20250425094130242.png)

##### git log --oneline -3

查看HEAD指向

![image-20250425094730920](/Users/soup/Documents/2025年工作包/images/image-20250425094730920.png)

##### git switch test  === git checkout test

切换分支

##### git switch -c test === git checkout -b test

创建并且切换分支，这里的-b是branch的意思

##### git merge test

合并分支

git merge feat/aa origin/test

合并远程oirgin的test到本地feat/aa分支

##### git branch -d test

删除分支

##### git fetch origin

从origin仓库中更新

git fetch --all

拉取所有远程信息

##### git push origin bug:originbug

将本地的bug分支推送到远程origin的originbug分支

##### git checkout -b test origin/test

从远程origin的test切出本地test，新建且切换HEAD到test上

本地的test就是远程origin/test的**跟踪分支**。tracking branch

origin/test就是上游分支   upstream branch

##### git remote -vv 

查看分支对应关系

![image-20250426104643886](/Users/soup/Documents/2025年工作包/images/image-20250426104643886.png)



##### git pull === git fetch + git merge

git fetch 将远程更新到本地仓库

git merge 合并的是本地仓库

![image-20250426110529880](/Users/soup/Documents/2025年工作包/images/image-20250426110529880.png)

##### git push origin --delete test

删除远程origin的test分支，推送远程删除这个分支

##### git checkout master  => git rebase test

变基，将test的差别提交都移至到master上，变成test的新的提交

跟merge的区别是，你在查看一个经过变基的分支的历史记录时会发现，尽管实际的开发工作是并行的， 但它们看上去就像是串行的一样，提交历史是一条直线没有分叉

![image-20250426145528128](/Users/soup/Documents/2025年工作包/images/image-20250426145528128.png)

场景：

<img src="/Users/soup/Documents/2025年工作包/images/image-20250426145623753.png" alt="image-20250426145623753" style="zoom:50%;" />

- merge

  <img src="/Users/soup/Documents/2025年工作包/images/image-20250426145645447.png" alt="image-20250426145645447" style="zoom:50%;" />

- rebase

  <img src="/Users/soup/Documents/2025年工作包/images/image-20250426145704203.png" alt="image-20250426145704203" style="zoom:50%;" />

**了解就好了，还是用merge吧，除非什么小修改就用rebase**

#### 4.7 协议

##### 本地协议

（这就跟计算机网络基础相关的知识连接在一起了，hhh，知识点连接起来了）

远程文件系统中有git仓库，只要用户授予权限就可以像gitlab一样去操作仓库数据了

![image-20250426155403055](/Users/soup/Documents/2025年工作包/images/image-20250426155403055.png)

git clone /nfs/repo.git      # NFS 路径
git clone //192.168.1.100/repo.git  # SMB 路径

##### HTTPS

使用用户名+权限token登录

mac会把这个保存在keychain；win会保存在凭证管理器

##### SSH

远程仓库使用公钥

##### Git

跟ssh协议类似，但是没有安全措施。要么谁都可以克隆这个版本库，要么谁也不能。 这意味着，通常不能通过 Git 协议推送。 由于没有授权机制，一旦你开放推送操作，意味着网络上知道这个项目 URL 的人都可以向项目推送数据。 不用说，极少会有人这么做。

一般的做法里，会同时提供 SSH 或者 HTTPS 协议的访问服务，只让少数几个开发者有推送（写）权限，其他人通过 `git://` 访问只有读权限。







看到这https://git-scm.com/book/zh/v2/%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8A%E7%9A%84-Git-%E5%9C%A8%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8A%E6%90%AD%E5%BB%BA-Git

## 小知识点

- Homebrew：mac的开源软件包管理器

  

- 