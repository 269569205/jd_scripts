#!/usr/bin/env bash

## Author: https://github.com/EvineDeng
## Modified： 2021-01-24
## Version： v1.0.0

## 网址、路径、文件、标记信息以及表头
WorkDir=$(cd $(dirname $0); pwd)
JsList=($(cd $WorkDir; ls *.js | grep -E "j[drx]_"))
FileReadme=$WorkDir/README.md
UrlBlob=https://github.com/LXK9301/jd_scripts/blob/master/
UrlRaw=https://raw.githubusercontent.com/LXK9301/jd_scripts/master/
SheetHead="| 文件 | 名称 | 活动入口 |\n| - | - | - |"

## 删除标记行的内容
StartLine=$(($(grep -n "标记开始" "$FileReadme" | awk -F ":" '{print $1}') + 1))
EndLine=$(($(grep -n "标记结束" "$FileReadme" | awk -F ":" '{print $1}') - 1))
Tail=$(perl -ne "$. > $EndLine && print" "$FileReadme")
perl -i -ne "{print unless $StartLine .. eof}" "$FileReadme"

## 生成新的表格并写入Readme
cd $WorkDir
Sheet=$SheetHead
for ((i=0; i<${#JsList[*]}; i++)); do
  Name=$(grep "new Env" ${JsList[i]} | awk -F "'|\"" '{print $2}')
  Entry=$(grep -E "活动入口" ${JsList[i]} | awk -F "：|: " '{print $2}')
  if [[ $(echo $Entry | grep "http") != "" ]]; then
    Entry="[活动地址]($Entry)"
  fi
  Raw="$UrlRaw${JsList[i]}"
  Sheet="$Sheet\n|[${JsList[i]}]($Raw)|$Name|$Entry|"
done
echo -e "$Sheet\n$Tail" >> $FileReadme