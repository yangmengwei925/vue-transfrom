---
title: 可读代码编写炸鸡二(下篇) - 命名的歧义
date: 2020-02-29 16:56:00
tags:
- 大炮
category:
- 计算机
mathjax: true
---

大家好，我是多选参数的一员 —— 大炮。

在上一篇炸鸡 [可读代码编写炸鸡二(上篇) - 命名的长度](https://multiparam.com/2020/02/29/dapao/code_clean_2/) 中，我们知道了：

> 由于代码命名添加信息后，存在 **命名长度** 和 **命名歧义** 这两个方面问题。

上一篇也提供了一些关于 **命名长度** 方面的一些建议。

所以接下来本篇炸鸡便提供一些关于 **命名歧义** 方面的一些建议。

同时不要忘记上一篇炸鸡中抛出的一个问题：

> 表达 **商店数量上限** 的常量命名可以是 ```MAX_SHOP_COUNT```，那 ```SHOP_COUNT_LIMIT``` 合适吗？ 

带着这个问题，我们开始吧。

# 命名的歧义
命名的歧义是如何产生的？

由于命名需要词汇组织，那么 **词汇的多义性** 可能会导致命名产生歧义。

同时程序员中 **约定俗成** 的规则也可能使得命名出现歧义。

百闻不如一见，举些例子和针对其的解决方法，希望能给你一点启发。

## filter()
```lua
    results = filter("year <= 2011")
```
这个 ```filter``` 方法，到底是过滤了什么。过滤了 2011 年以前的数据，还是过滤了 2011 年以后的数据？

如果需要这些数据，不妨使用 select()
```lua
    results = select("year <= 2011")
```
如果想过滤掉这些数据，不妨使用 exclude()
```lua
    results = exclude("year <= 2011")
```
所以用更具体的意思来表达功能，是更妥当的。



## clip(text, length)

函数 ```clip``` 代表缩短的意思，将文本做一个缩短操作。

但是，这个方法在阅读者角度，就产生歧义。这个 ```clip``` 可能存在两种意思：

* 若函数本意是
    > 将输入的 text 按照 length 长度，将 text 结尾 length 字符移除。

    那命名为 ```clipTail``` 也许会更贴近本意一些。

* 若函数本意是
    > 将整个文本截断为最大长度 length。

    那命名为 ```clipTo``` 会不会更恰当一些？

同时我们也可以看出，```length``` 也充满了歧义，如果写成 ```max_length```，可能就稍微清晰一些。

但是这个 ```max_length``` 是 ```text``` 的字符串长度，还是字节长度，还是包含单词个数？

很明显，先前文章 [可读代码编写炸鸡一](https://multiparam.com/2020/02/18/dapao/code_clean_1/) 提到的，加入更多的信息的一个办法 —— 加入单位。

* max_chars
* max_bytes
* max_words


## 包含或者不包含
比如说，需要一个常量来规定购物车数量限制。

```lua
ITEM_IN_CART_LIMIT = 10
```

是要大于 10，还是大等于 10，才算超过限制？

亦或是小于 10，还是小等于 10，才算超过限制？

最好的办法就是加上 ```min/max``` 前缀。

如果换成 ```MAX_ITEM_IN_CART```, 这个就一目了然是最大个数的限制。

还有一个类似的问题，便是区间问题。假设我们有一个函数，根据传入区间左右两点来生成一串序列。

```lua
function intRange(start, stop)
    ...
end
```

那调用函数时，```intRange(n, m)```，返回的序列存在四种情况：
* $(n, m)$
* $[n, m]$
* $(n, m]$
* $[n, m)$

所以 ```intRange(start, stop)``` 这样的函数原型，参数的命名会带来一定歧义。

所以如果是要两端都包含，也就是 $[n, m]$ ，最好使用 ```first/last``` 作为命名。

那么如果是要表达 $[n, m)$ 呢。那就是使用 ```begin/end```。但是这两个太惯用了，例如 ```lua``` 就是用 ```end``` 来作为函数的范围结尾限定。可以试用 ```ending```。

## 命名布尔值变量
关于命名布尔值变量产生的歧义，举一个 ```bool read_password``` 例子。

这个变量会出现两种意思。

* 是否需要读 ```password```
* 或者是 ```password``` 已经是否被读了。

所以 ```read``` 这个词还是换了。如果要表达第一种意思，可以用 ```need_password```。

第二种意思的话，就用 ```user_is_authenticated```。

所以，善于使用 ```is, has, can, should```， 都可使得布尔值命名传达的信息更加清晰，而且让人读了就知道，这是布尔值变量。


同时再举一个例子，这个例子我的项目组挺喜欢用的，就是使用带有 **否定意味** 的词语。

* ```noSync = false```
* ```disable_ssl = false```

这样绕不绕？

所以 **否定意味** 的词语尽量不要加入布尔变量的命名。

我这么改造一下，意思就明朗多了，不需要绕来绕去九曲十八弯。
* ```needSync = false```
* ```is_use_ssl = false```。

## 约定俗成误导阅读者
### get()
一般情况下，```get``` 方法一般是被用于返回类的 **轻量级** 的内部成员，或者说，```get``` 方法内部逻辑不复杂不繁重。

但是如果一个方法中存在大量的数据计算或者内存分配，只有一个 ```get``` ，就可能忽略了方法中大量的重的逻辑。

例如我们有一个 ```getCityInfo``` 的方法

```lua
function getCityInfo()
    for _, city in pairs(cities) do
        for cityId, info in pairs(city) do
            ...
            ...
        end
    end
end
```
由于 ```get``` 的存在，会让阅读者和使用者产生 **这个操作很轻量** 的错觉而泛滥使用，使得程序效率下降。

换成 ```computeXXX()```, ```allocateXXX()``` 会更好一些。

我所在的项目中，主程倒是推荐我们使用 ```fetchxxx()```。这样就能告诉阅读者，这是繁重的操作，谨慎使用。

### list->size()
在链表实现代码中，常常有求链表长度的操作，不少人将其命名为 ```size```。

这个 ```size```，很容易会被当做是一个 **属性** 被返回，但是如果代码如下：
```c++
int List::size() {
    int count = 0;
    while (this->list.next() !=NULL) {
        count ++;
    }
    return count;
}
```
由上述代码可知，```size``` 不仅是一个方法，还是一个 **操作很繁重** 的方法。

除了上文提到的利用 ```computeXXX()```、 ```allocateXXX()``` 、```fetchxxx()``` 修改命名，让阅读者知晓以外，还可以直接修改代码实现：
```c++
void List::insert() {
    ...
    ...
    this->_size += 1;
}

int List::size() {
    return this->_size;
}
```
让 ```List``` 保存一个 ```_size``` 成员变量来记录链表长度。这样就不用每次都遍历链表来求长度了。 

# 回顾开头的问题

> 表达 **商店数量上限** 的常量命名可以是 ```MAX_SHOP_COUNT```，那 ```SHOP_COUNT_LIMIT``` 合适吗？ 

现在不知道你心中有答案了吗？

# 总结

* 好的命名要将歧义出现的可能降到最低。```filter```，```length``` 这些其实都充满歧义，使用更加具体的意义命名。

* 如果要有个表示上下限变量，```max/min``` 前缀是个好选择。

* 如果是表示 $[n, m]$ 这个区间，用 ```first/last ``` 比较好。

* 如果是表示 $[n, m)$ 这个区间，用 ```begin/ending,end``` 比较好。

* 命名一个布尔值变量，善用 ```can, is, has``` 等修饰。同时，否定意味的词，例如 ```disable_ssl```，```noSync``` 尽量不用。
    
    > 我们可以使用 ```is_use_ssl```、```needSync```

    
    
* 由于一些约定俗成的规则，阅读者还是容易对一个词产生惯性思维。例如 ```get()```, ```List::size()```，会传递一个 **轻量操作** 的错误信息。

    > 我们可以使用 ```computeXXX()```、 ```allocateXXX()``` 、```fetchxxx()``` 修改命名，告诉阅读者函数的意图。同时也可以修改函数实现来贴合这些约定俗成的规则。
    
    