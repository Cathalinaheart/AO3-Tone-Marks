// ==UserScript==
// @name         Tone Marks II
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Add tone marks on Ao3 works
// @author       irrationalpie7
// @match        https://archiveofourown.org/*
// @updateURL    https://github.com/irrationalpie7/AO3-Tone-Marks/raw/main/Tone%20Marks%20II.pub.user.js
// @downloadURL  https://github.com/irrationalpie7/AO3-Tone-Marks/raw/main/Tone%20Marks%20II.pub.user.js
// @grant        none
// ==/UserScript==

(function() {
'use strict';

function doTheThing() {
  // Check whether this page is an ao3 work.
  const works_regex = /https:\/\/archiveofourown\.org(\/.*)?\/works\/[0-9]+.*/;
  const blurbs_regex =
      /https:\/\/archiveofourown\.org(\/.*)?\/(works|bookmarks)\/?(\?.*|$|)$/;

  let didSomething = false;
  if (window.location.href.match(works_regex) !== null) {
    console.log('On a works page, potentially making pinyin replacements...')
    didSomething = doReplacements(document.getElementById('main'));
  } else if (window.location.href.match(blurbs_regex) !== null) {
    console.log(
        'On a bookmark or search page, potentially making pinyin replacements...')
    // get all the work blurbs
    const blurbs = Array.from(document.querySelectorAll('.blurb'));
    for (let i = 0; i < blurbs.length; i++) {
      didSomething = doReplacements(blurbs[i]) || didSomething;
    }
  }
  if (!didSomething) {
    return;
  }

  // Set styling for replacements.
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  const css = `
        .replacement{
        text-decoration: underline;
        }
        `;
  style.textContent = css.trim();
  const main = document.getElementById('main');
  main.append(style);
}
doTheThing();

/**
 * Replace special html and/or regex characters characters.
 * @param {string} str
 * @returns {string}
 */
function escaped(unsafe) {
  return (unsafe + '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll('\'', '&#039;')
      .replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
}

/**
 * Returns a regex to match a sequence of words, allowing an optional
 * dash (-) or space ( ) between each word. The beginning and end of the
 * matching sequence must be at a word boundary.
 * @param {string[]} words
 * @return {RegExp}
 */
function wordsMatchRegex(words) {
  return new RegExp(
      '\\b(' + words.map(word => escaped(word)).join('( |-)?') + ')\\b', 'gi');
}

/**
 * Wrap the replacement in a span.
 * @param {string} replacement The new text
 * @param {string} match The original text which is being replaced
 * @return {string}
 */
function replacementHtml(replacement, match) {
  return '<span class="replacement" data-orig="' + escaped(match) +
      '" data-new="' + escaped(replacement) + '">' + escaped(replacement) +
      '</span>';
}

/**
 *
 * @param {{innerHTML: string}} main
 * @param {RegExp} from
 * @param {string} to
 */
function replaceTextOnPage(main, from, to) {
  main.innerHTML = main.innerHTML.replace(from, (match) => {
    return replacementHtml(to, match);
  });
}

/**
 * Checks whether 'fandom' (ignoring case) is a substring of any of the fandom
 * tags.
 * @param {string} fandom
 * @param {Element[]} fandomTags
 * @returns {boolean}
 */
function hasFandom(fandom, fandomTags) {
  const fandomRegex = new RegExp(fandom, 'i');
  for (let i = 0; i < fandomTags.length; i++) {
    if (fandomTags[i].innerHTML.match(fandomRegex) !== null) {
      return true;
    }
  }
  return false;
}

/**
 *
 * @param {HTMLElement} element
 * @returns {boolean} whether any changes were made to the element
 */
function doReplacements(element) {
  const simplified = {innerHTML: element.innerHTML};

  // Anything with a 'tag' class that's a descendant of something with a
  // 'fandom' or 'fandoms' class.
  const workFandoms =
      Array.from(element.querySelectorAll('.fandoms .tag,.fandom .tag'));
  if (hasFandom(workFandoms, 'Untamed') || hasFandom(workFandoms, 'Módào')) {
    replaceAll(mdzsReplacements(), simplified);
  }
  if (hasFandom(workFandoms, 'Guardian')) {
    replaceAll(guardianReplacements(), simplified);
  }
  if (hasFandom(workFandoms, 'Nirvana in Fire')) {
    replaceAll(nirvanaReplacements(), simplified);
  }
  replaceAll(genericReplacements(), simplified);

  // Return now if it turns out we didn't make any changes.
  if (simplified.innerHTML === element.innerHTML) {
    console.log('No matching fandoms, or no text found that needed replacing.')
    return false;
  }

  // This is the line where everything could possibly explode if we haven't
  // escaped things properly.
  element.innerHTML = simplified.innerHTML;
  return true;
}

/**
 * Turn a long replacements string into a list of match objects, where:
 *  - match.words is an array of strings that form the individual words to
 * match
 *  - match.replacement is the text to replace that sequence with
 *
 * @param {string} replacements
 * @returns {{words:string[],replacement:string}}
 */
function splitReplacements(replacements) {
  return replacements.split('\n')
      .map(function(line) {
        return line.trim();
      })
      .filter(function(line) {
        return line.length > 0 && !line.startsWith('#');
      })
      .map(function(line) {
        const match = line.split('|');
        return {
          words: match[0].split(' ').filter(match => match.length > 0),
          replacement: match[1].trim()
        };
      });
}

/**
 * Use the hard-coded replacement rules string to replace matches with pinyin
 * in the associated doc.
 * @param {string} allReplacementsString
 * @param {{innerHTML: string}} main
 */
function replaceAll(allReplacementsString, main) {
  const replacements = splitReplacements(allReplacementsString);
  replacements.forEach(function(element) {
    replaceTextOnPage(
        main, wordsMatchRegex(element.words), element.replacement);
  });
}

// About the <fandom>Replacements functions:
//
// For each line 'some text here|fancy replacement', replaces all instances of
// 'some text here' in the doc with 'fancy replacement'.
// Notes:
//  * capitalization on the left side is ignored
//  * any spaces on the left side that are between words will matching things
//      with
//      (a) no space there (b) a dash there or (c) a space there. Examples:
//      - 'hanguang jun|Hánguāng-jūn' means any of 'hanguang jun',
//        'hanguangjun', or 'hanguang-jun' will be replaced with
//        'Hánguāng-jūn'
//      - 'wen ke xing|Wēn Kèxíng' means that all of 'Wen KeXing', 'Wen Ke
//        Xing', and 'wen kexing' will be replaced with 'Wēn Kèxíng'
//  * any spaces on the left or right that are before all words or after all
//      words will be ignored
//  * partial-word matches will be ignored (e.g., if 'lan' is part of 'plan'
//      or 'land' it will not be replaced; if 'lan sect' is part of 'plan sect'
//      it will not be replaced)
//  * lines with only spaces on them, or that start with #, will be ignored.

/**
 * Hard-coded generic pinyin replacement rules.
 */
function genericReplacements() {
  return `
      # titles
      daren|dàren
      guifei|gùifēi
      furen|fūren
      ## I *think* guniang is this --> 姑娘?
      guniang|gūniang
      ## gongzi (公子, gōngzī)
      gongzi|gōngzī

      # sibling relations
      ## Eldest brother: 大哥
      dage|dàgē
      ## Elder brother: 哥哥
      gege|gēge
      ge|gē
      ## Elder sister 姐姐
      jiejie|jiějie
      ## sect sister (elder) 师姐
      shijie|shījiě
      jie|jiě
      ## Elder brother (more formal) 兄长
      xiongzhang|Xiōngzhǎng
      ## (name-)xiong (兄 Xiōng)
      xiong|xiōng

      # misc
      ## Jiāng Hú 江湖
      jianghu|Jiānghú
      ## guqin ( Chinese: 古琴;  pinyin: gǔqín)
      guqin|gǔqín
      `;
}

/**
 * Hard-coded MDZS pinyin replacement rules.
 */
function mdzsReplacements() {
  return `
      # Yunmeng Jiang Sect and related stuff
      ## Wei Ying (魏婴 Wèi Yīng), courtesy name Wei Wuxian (魏无羡, Wèi Wúxiàn) and his title Yiling Patriarch (夷陵老祖, Yílíng Lǎozǔ)
      wei ying|Wèi Yīng
      wei wuxian|Wèi Wúxiàn
      wy|Wèi Yīng
      wwx|Wèi Wúxiàn
      a xian|Ā-Xiàn
      young master wei|Young Master Wèi
      yiling patriarch|Yílíng Patriarch
      yiling laozu|Yílíng Lǎozǔ
      yiling|Yílíng
      laozu|Lǎozǔ
      wei|Wèi
      wuxian|Wúxiàn
      ## Jiang Cheng (江澄 Jiāng Chéng), courtesy name Jiang Wanyin (江晚吟 Jiāng Wǎnyín), and his title Sandu Shengshou (三毒圣手 Sāndú shèngshǒu)
      jiang cheng|Jiāng Chéng
      a cheng|Ā-Chéng
      sandu shengshou|Sāndú Shèngshǒu
      sandu|Sāndú
      shengshou|Shèngshǒu
      wanyin|Wǎnyín
      ## Yu Ziyuan (虞紫鸢, Yú Zǐyuān) and title Madam Yu (虞夫人, Yú fūrén) and the Violet Spider (紫蜘蛛, Zǐ Zhīzhū).
      yu ziyuan|Yú Zǐyuān
      yu furen|Yú fūrén
      madame yu|Madame Yú
      zi zhizhu|Zǐ Zhīzhū
      ziyuan|Zǐyuān
      ## Jiang Fengmian (江枫眠, Jiāng Fēngmián)
      jiang fengmian|Jiāng Fēngmián
      fengmian|Fēngmián
      ## Jiang Yanli (江厌离, Jiāng Yànlí)
      jiang yanli|Jiāng Yànlí
      yanli|Yànlí
      ## hmmmmmm technically this could also be the unit "a li" (~.5 km), so maybe remove
      a li|Ā-Lí
      ## Zidian (紫电, Zǐdiàn), Chenqing  陈情 Chén qíng, Suibian 随便 Suíbiàn
      zidian|Zǐdiàn
      chenqing|Chénqíng
      suibian|Suíbiàn
      ## Yunmeng Jiang Sect (云梦江氏, Yúnmèng Jiāng Shì)
      sect leader jiang|Sect Leader Jiāng
      yunmeng jiang shi|Yúnmèng Jiāng Shì
      yunmeng|Yúnmèng
      jiang|Jiāng

      # Lanling Jin Sect
      ## Jin Zixuan (金子轩, Jīn Zixuān)
      jin zixuan|Jīn Zixuān
      zixuan|Zixuān
      ## Jin Ling (金凌, Jīn Líng), courtesy name Jin Rulan (金如兰, Jīn Rúlán)
      jin ling|Jīn Líng
      a ling|Ā-Líng
      jin rulan|Jīn Rúlán
      rulan|Rúlán
      ## Jin Guangshan (金光善, Jīn Guāngshàn)
      jin guangshan|Jīn Guāngshàn
      ## Jin Guangyao (金光瑶, Jīn Guāngyáo), birth name Meng Yao (孟瑶, Mèng Yáo)
      jin guangyao|Jīn Guāngyáo
      guangyao|Guāngyáo
      meng yao|Mèng Yáo
      a yao|Ā-Yáo
      ## Mo Xuanyu (莫玄羽, Mò Xuányǔ)
      mo xuanyu|Mò Xuányǔ
      xuanyu|Xuányǔ
      senior mo|Senior Mò
      ## Mian Mian (Chinese: 绵绵; Miánmián)
      mian mian|Miánmián
      luo qingyang|Luó Qīngyáng
      qingyang|Qīngyáng
      ## Other
      jin zixun|Jīn Zixūn
      zixun|Zixūn
      ## Carp Tower (金鳞台, Jīnlín Tái; also: Koi Tower, Jinlin Tower)
      jin lin tower|Jīnlín Tower
      jin lin tai|Jīnlín Tái
      ## Lanling Jin Sect (兰陵金氏, Lánlíng Jīn Shì)
      langling jin shi|Lánlíng Jīn Shì
      langling jin|Lánlíng Jīn
      lanling|Lánlíng
      jin|Jīn

      # Gusu Lan Sect
      ## Lan Zhan (蓝湛 Lán Zhàn), courtesy name Lan Wangji (蓝忘机, Lán Wàngjī) , and title Hanguang-Jun (含光君, Hánguāng-jūn),
      lan zhan|Lán Zhàn
      zhan|Zhàn
      lan wang ji|Lán Wàngjī
      lwj|Lán Wàngjī
      wangji|Wàngjī
      hanguang jun|Hánguāng-jūn
      master lan|Master Lán
      ## Lan Qiren (蓝启仁, Lán Qǐrén)
      lan qiren|Lán Qǐrén
      qiren|Qǐrén
      ## Lan Huan (蓝涣, Lán Huàn), courtesy name Lan Xichen (蓝曦臣, Xīchén) and title Zewu-Jun (泽芜君, Zéwú-jūn)
      lan huan|Lán Huàn
      lan xichen|Lán Xīchén
      xichen|Xīchén
      zewu jun|Zéwú-jūn
      ## Lan Yuan (蓝愿, Lán yuàn) courtesy name Lan Sizhui (思追, Lán Sīzhuī) and born Wen Yuan (温苑, Wēn yuàn)
      lan yuan|Lán Yuàn
      a yuan|Ā-Yuàn
      lan sizhui|Lán Sīzhuī
      sizhui|Sīzhuī
      wen yuan|Wēn Yuàn
      ## Lan Jingyi (蓝景仪, Lán Jǐngyí)
      lan jingyi|Lán Jǐngyí
      jingyi|Jǐngyí
      ## Caiyi Town (彩衣城, Cǎiyī Chéng)
      caiyi town|Cǎiyī Town
      caiyi cheng|Cǎiyī Chéng
      ## Jìngshì (静室, jìng shì)
      jingshi|Jìngshì
      ## Bichen (避尘, Bìchén)
      bichen|Bìchén
      ## Gusu Lan Sect (姑苏蓝氏, Gūsū Lán Shì), Gusu (姑苏, Gūsū)
      gusu lan shi|Gūsū Lán Shì
      gusu lan|Gūsū Lán
      # don't match lan|Lán because we might miss Song Lan
      gusu|Gūsū

      # Qinghe Nie Sect
      ## Nie Huaisang (聂怀桑, Niè Huáisāng)
      nie huaisang|Niè Huáisāng
      huaisang|Huáisāng
      ## Nie Mingjue (聂明玦, Niè Míngjué)
      nie mingjue|Niè Míngjué
      mingjue|Míngjué
      ## Other
      nie zonghui|Niè Zōnghuī
      zonghui|Zōnghuī
      ## Qinghe Nie Sect (清河聂氏, Qīnghé Niè Shì)
      qinghe nie shi|Qīnghé Niè Shì
      qinghe nie|Qīnghé Niè
      qinghe|Qīnghé
      nie|Niè

      # Qishan Wen Sect
      ## Wen Ning (温宁, Wēn Níng), courtesy name Qionglin (温琼林, Qiónglín)  Known as the Ghost General (鬼将军, Guǐ jiāngjūn)
      Wen Ning|Wēn Níng
      Wen Qionglin|Wēn Qiónglín
      Qionglin|Qiónglín
      Gui Jiangjun|Guǐ jiāngjūn
      ## Wen Qing (温情, Wēn Qíng)
      Wen Qing|Wēn Qíng
      ## Wen Ruohan (温若寒, Wēn Ruòhán)
      Wen Ruohan|Wēn Ruòhán
      ## Wen Chao (温晁, Wēn Cháo)
      Wen Chao|Wēn Cháo
      ## Wen Xu (温旭, Wēn Xù)
      Wen Xu|Wēn Xù
      ## Wen Zhuliu (Wēn Zhúliú 温逐流)
      Wen Zhu Liu|Wēn Zhúliú
      Zhu Liu|Zhúliú
      ## Qishan Wen Sect (岐山温氏, Qíshān Wēn Shì)
      Qishan Wen Shi|Qíshān Wēn Shì
      Qishan Wen|Qíshān Wēn
      Qishan|Qíshān
      Da Fan Wen|Dàfàn Wēn
      Wen|Wēn

      # misc people
      ## Song Lan (宋岚, Sòng Lán), courtesy name Song Zichen (宋子琛)
      Song Lan|Sòng Lán
      Song Zichen|Sòng Zichēn
      Zichen|Zichēn
      ## Fuxue (拂雪, Fúxuě)
      Fuxue|Fúxuě
      ## Xiao Xingchen (晓星尘, Xiǎo Xīngchén)
      Xiao Xingchen|Xiǎo Xīngchén
      Xingchen|Xīngchén
      ## Shuanghua (霜华, Shuānghuá)
      Shuanghua|Shuānghuá
      ## Xue Yang (薛洋, Xuē Yáng)
      Xue Yang|Xuē Yáng
      ## Baoshan Sanren (抱山散人, Bàoshān sànrén)
      Baoshan Sanren|Bàoshān Sànrén
      ## Cangse Sanren (藏色散人, Cángsè Sànrén)
      Cangse Sanren|Cángsè Sànrén
      Zangse Sanren|Zángsè Sànrén
      ## Ouyang Zizhen (欧阳子真 Ōuyáng Zizhēn)
      Ouyang Zizhen|Ōuyáng Zizhēn

      # misc other
      ## gongzi (公子, gōngzī)
      Gongzi|gōngzī
      ## guqin ( Chinese: 古琴;  pinyin: gǔqín)
      Guqin|gǔqín
      ## Yi City (Chinese: 义城; pinyin: Yì chéng)
      Yi City|Yì City
      Yi Cheng|Yì Chéng
      ## Dafan Mountain (大梵山, Dà fàn shān)
      Da Fan Mountain|Dàfàn Mountain
      Da Fan Shan|Dàfàn shān
      ## 大哥 dà gē
      da ge|dàgē
      ## ge (Chinese: 哥; pinyin: gē)
      -Ge|-gē
      ## Gege (Chinese: 哥哥; pinyin: Gégé)
      Gege|gēge
      ## xiōngzhǎng 兄长
      xiong zhang|Xiōngzhǎng
      ## xiong (兄 Xiōng)
      -Xiong|-xiōng
      ## Jiejie (Chinese: 姐姐, Jiějiě)
      Jiejie|jiějiě
      ## shī jiě 师姐
      Shijie|shījiě
      ## Jie (Chinese: 姐, Jiě)
      -Jie|-jiě
      ## qiánkūn dài 乾坤袋 (Qiankun bag)
      qiankun dai|qiánkūn dài
      qiankun|qiánkūn
      ## Hánshì 寒室 - LXC’s room
      hanshi|Hánshì
      ## Míngshì 冥室 - Building where they do summonings
      mingshi|Míngshì
      ## Yǎshì 雅室 - For receiving visitors
      yashi|Yǎshì
      ## Lánshì 兰室 - Classroom
      lanshi|lanshi


      # attempt to match lan|Lán at the end, after conflict with Song Lan doesn't matter
      lan|Lán
      `;
}

/**
 * Hard-coded Guardian pinyin replacement rules.
 */
function guardianReplacements() {
  return `
      # guardian
      ## Zhao Yunlan (赵云澜 / 趙云瀾, Zhào Yúnlán)
      Chief Zhao|Chief Zhào
      Zhao Yun Lan|Zhào Yúnlán
      Yunlan|Yúnlán
      ## in the past: Kunlan Kūnlún | 昆仑
      Kunlun|Kūnlún
      ## Shen Wei (沈巍	Shěn Wēi) or Xiao Wei Xiǎo Wēi 小巍
      Shen Wei|Shěn Wēi
      Professor Shen|Professor Shěn
      Hei Pao Shi|Hēi Páo Shǐ
      Xiao Wei|Xiǎo Wēi")
      ## Zhao Xinci (赵心慈	Zhào Xīncí)
      Zhao Xin Ci|Zhào Xīncí
      ## Guo Ying 郭英 Guō Yīng
      Guo Ying|Guō Yīng
      ## Guo Changcheng 郭长城 Guō Chángchéng
      Guo Chang Cheng|Guō Chángchéng
      ## Zhu Hong 祝红 Zhù hóng
      Zhu Hong|Zhù Hóng
      ## Da Qing 大庆 Dàqìng
      Da Qing|Dà Qìng
      ## Chu Shuzhi 楚恕之 Chǔ shù zhī
      Chu Shu Zhi|Chǔ Shùzhī
      ## Wang Zheng 汪徵 Wāng zhēng
      Wang Zheng|Wāng Zhēng
      ## Lin Jing 林静 Lín Jìng
      Lin Jing|Lín Jìng
      ## Sang Zan 桑赞 Sāng Zàn
      Sang Zan|Sāng Zàn
      ## Old Li 老李 lǎo Lǐ Old Lǐ
      Old Li|Old Lǐ
      Lao Li|Lǎo Lǐ
      ## Ye Zun 夜尊 Yè Zūn
      Ye Zun|Yè Zūn
      ## Zhu Jiu 烛九 Zhú jiǔ
      Zhu Jiu|Zhú jiǔ
      ## Ya Qing 鸦青 Yā Qīng
      Ya Qing|Yā Qīng
      ## Sha Ya 沙雅 Shā Yǎ
      Sha Ya|Shā Yǎ
      ## Wang Xiangyang 王向阳 Wáng Xiàngyáng
      Wang Xiang Yang|Wáng Xiàngyáng
      ## Li Qian 李茜 Lǐ Qiàn
      Li Qian|Lǐ Qiàn
      ## Cheng Xinyan 成心妍 Chéng Xīnyán
      Cheng Xin Yan|Chéng Xīnyán
      ## Ouyang Zhen 欧阳贞 Ōuyáng Zhēn
      Ou Yang Zhen|Ōuyáng Zhēn
      ## Professor Zhou 周教授 Zhōu-jiàoshòu
      Professor Zhou|Professor Zhōu
      Teacher Zhou|Teacher Zhōu
      Zhou Jiao Shou|Zhōu-jiàoshòu
      ## Wu Tian'en 吴天恩 Wú Tiān'ēn
      Wu Tian En|Wú Tiān'ēn
      ## Wu Xiaojun 吴晓君 Wú Xiǎojūn
      Wu Xiao Jun|Wú Xiǎojūn
      ## Fourth Uncle 四叔 Sì Shū
      si shu|Sì Shū
      ## Ying Chun 迎春 Yíng Chūn
      Ying Chun|Yíng Chūn
      ## Cong Bo 丛波 Cóng Bō
      Cong Bo|Cóng Bō
      ## Gao Jingfeng 高劲风 Gāo Jìngfēng
      Gao Jing Feng|Gāo Jìngfēng
      ## An Bai 安柏 Ān Bǎi
      An Bai|Ān Bǎi
      ## Ye Huo 野火 Yě Huǒ
      Ye Huo|Yě Huǒ
      ## Da Ji 大吉 Dà Jí
      Da Ji|Dà Jí
      ## Bai Suxia 白素霞 Bái Sùxiá
      Bai Su Xia|Bái Sùxiá
      ## Shen Xi 沈溪 Shěn Xī
      Shen Xi|Shěn Xī
      ## Zhang Shi 獐狮 Zhāng Shī
      Zhang Shi|Zhāng Shī
      ## Chu Nianzhi 楚念之 Chǔ Niànzhī
      Chu Nian Zhi|Chǔ Niànzhī
      ## Guo Changjiang 郭长江 Guō Chángjiāng
      Guo Chang Jiang|Guō Chángjiāng
      ## Guo Xiong 郭雄 Guō Xióng
      Guo Xiong|Guō Xióng

      # PLACES
      ## Dragon City (龙城 Lóng chéng)
      Long Cheng|Lóng Chéng
      Long City|Lóng City

      # TERMS
      ## Haixing 海星 Hǎixīng
      Hai Xing|Hǎixīng
      ## Dixing 地星(人) Dexīngrén
      Di Xing Ren|Dixīngrén
      Di Xing|Dixīng
      Ya Shou|Yàshòu
      ## Rebel Chieftain 贼酋 zéiqiú
      Zei Qiu|Zéiqiú
      ## Regent  摄政官 shèzhènggūan
      She Zheng Guan|Shèzhènggūan
      `;
}

/**
 * Hard-coded Nirvana in Fire pinyin replacement rules.
 */
function nirvanaReplacements() {
  return `
      # Mostly from: https://lunatique.dreamwidth.org/221558.html
      ## I (irrationalpie) changed some capitalization and spacing?
      ## But I was just guessing

      # Láng Yá Băng  琅琊榜
      lang ya bang|Láng Yá Băng

      # Part 1 - Main Cast (MCS, NH, JY, LC)
      ## Méi Cháng Sū 梅长苏
      mei chang su|Méi Chángsū
      chang su|Chángsū
      ## Sū Zhé 苏哲
      su zhe|Sū Zhé
      ## Lín Shū 林殊
      lin shu|Lín Shū
      ## xiăo-Shū 小殊
      xiao shu|xiăo-Shū
      ## Zōng zhŭ 宗主 (Chief)
      zong zhu|Zōngzhŭ
      ## Sū xiānsheng 苏先生 (Sir Su)
      su xian sheng|Sū xiānsheng
      sir su|Sir Sū
      su manor|Sū Manor
      ## Sū gēge 苏哥哥 (big brother)
      su gege|Sū gēge
      ## Mù Ní Huáng 穆霓凰
      ## Ní Huáng jiějie  霓凰姐姐 (big sister)
      mu ni huang|Mù Níhuáng
      ni huang|Níhuáng
      mu manor|Mù Manor
      ## Ní Huáng Jùn Zhŭ  霓凰郡主 (Princess/Duchess)
      ## idk if this title can go alone, but here's my attempt
      ## at capitalization
      Níhuáng jun zhu|Níhuáng jùnzhŭ
      jun zhu|Jùnzhŭ
      ## Xiāo Jĭng Yán 萧景琰
      xiao jing yan|Xiāo Jĭngyán
      jing yan|Jĭngyán
      ## Jìng wáng 靖王 (Prince Jing)
      jing wang|Jìng wáng
      prince jing|Prince Jìng
      jing manor|Jìng Manor
      ## Diàn xià 殿下 (your highness)
      dian xia|Diànxià
      ## Shŭi Niú 水牛 (water buffalo)
      shui niu|Shŭiniú

      # Lìn Chén 蔺晨 / Lìn Chén gēge 蔺晨哥哥 (big brother)
      lin chen ge ge|Lìn Chén gēge
      lin chen|Lìn Chén
      ## Shào Gé Zhŭ 少阁主(Young Master)
      ## ¯\_(ツ)_/¯ no idea on spacing/caps
      shao ge zhu|Shào Gézhŭ

      # Part 2 - Jiang Zuo Alliance (FL,LG,ZP,GY,TL,MiaoYin,Mr13,PhysYan)
      ## Jiāng Zuŏ Méng 江左盟 (Jiang Zuo Alliance)
      jiang zuo meng|Jiāngzuŏ Méng
      jiang zuo|Jiāngzuŏ
      ## Fēi Liú 飞流
      Fei Liu|Fēi Liú
      ## Lí Gāng 黎纲
      li gang|Lí Gāng
      ## Zhēn Píng 甄平
      zhen ping|Zhēn Píng
      ## Gōng Yŭ 宫羽 (I think I also heard her called guniang/姑娘?)
      gong yu|Gōng Yŭ
      gong gu niang|Gōng gūniang
      ## Wèi Zhēng 卫峥
      wei zheng|Wèi Zhēng
      ## Tóng Lù 童路
      tong lu|Tóng Lù
      ## Shísān xiānsheng 十三先生(Mr. Shisan)
      shi san xian sheng|Shísān xiānsheng
      ## Yàn dàifu  晏大夫(Physician Yan)
      yan daifu|Yàn dàifu

      # Part 3 - Households (MQ,LX,JinYang,NF,LZY,QM,TS,Foya,etc)
      ## Chìyàn Jūn 赤焰军 (Chìyàn army)
      chiyan jun|Chìyàn Jūn
      chiyan|Chìyàn
      ## Cháng Lín Jūn 长林军 (Cháng Lín army)
      changlin jun|Chánglín Jūn
      changlin|Chánglín

      # Mù Qīng  穆青 / Qīng-er 青儿
      mu qing|Mù Qīng
      qing er|Qīng-er
      ## General Lín Xiè 林燮 / fù shuài 父帅 (father-general)
      lin zie|Lín Xiè
      fu shuai|fùshuài
      ## Jìn Yáng 晋阳 (Grand Princess Jin Yang) (lin shu's mother)
      jin yang|Jìnyáng
      ## lin manor, lin family
      lin manor|Lín Manor
      lin family|Lín family
      ## Niè Fēng 聂锋 / Niè dage 聂大哥
      nie feng|Niè Fēng
      nie dage|Niè dàgē
      ## Niè Duó 聂铎
      nie duo|Niè Duó

      # Liè Zhàn Yīng 列战英
      lie zhan ying|Liè Zhànyīng
      zhan ying|Zhànyīng
      ## Qī Mĕng 戚猛
      qi meng|Qī Mĕng
      ## Xiāo Tíng Shēng 萧庭生
      xiao ting sheng|Xiāo Tíngshēng
      ting sheng|Tíngshēng
      ## Fóyá 佛牙
      fo ya|Fóyá

      # Part 4 - Royal Palace (dadperor, JYu,JH,CP,Jingmom,consorts)
      ## Liáng Royal Family
      ## Xiāo Xuǎn 萧选 / Bì Xià 陛下 (your majesty) aka dadperor
      xiao xuan|Xiāo Xuǎn
      bi xia|Bìxià
      ## Xiāo Jĭng Yŭ, 萧景禹 / Prince Qí 祁王 aka whalebro
      xiao jing yu|Xiāo Jĭngyŭ
      jing yu|Jĭngyŭ
      qi wang|Qí wáng
      prince qi|Prince Qí
      ## Xiāo Jĭng Huán萧景桓 / Prince Yù  誉王
      xiao jing huan|Xiāo Jĭnghuán
      jing huan|Jĭnghuán
      yu wang|Yù wáng
      prince yu|Prince Yù
      yu manor|Yù Manor
      ## Xiāo Jĭng Xuān 萧景宣 / Prince Xiàn / 太子 Tài Zĭ (crown prince)
      xiao jing xuan|Xiāo Jĭngxuān
      jing xuan|Jĭngxuān
      xian wang|Xiàn wáng
      prince xian|Prince Xiàn
      tai zi|Tàizĭ
      ## Jì wáng 纪王 (Prince Jì)
      ji wang|Jì wáng
      prince ji|Prince Jì
      ## Princess Jĭng Níng 景宁
      jing ning|Jĭngníng

      # Tàinăinai 太奶奶 (Great-grandmother)
      tai nai nai|Tàinăinai
      ## Jìng fēi 静妃 (Consort Jing)
      jing fei|Jìng fēi
      consort jing|Consort Jìng
      concubine jing|Concubine Jìng
      ## Lì Yáng 莅阳 (Grand Princess Liyang)
      li yang|Lìyáng
      ## Yán hòu 言后 (Empress Yan)
      ## (conflicts with Marquis Yán (Yán hóuyé 言侯爷), so move to the end)
      ### yan hou|Yán hòu
      ## Yuè gùi fēi 越贵妃 (Noble Consort Yue)
      yue gui fei|Yuè gùifēi
      consort yue|Consort Yuè
      concubine yue|Concubine Yuè
      ## Hùi fēi 惠妃 (Consort Hui)
      hui fei|Hùi fēi
      consort hui|Consort Hùi
      concubine hui|Concubine Hùi
      ## Chén fēi 陈妃 (Consort Chen) / Lín Yùeyáo 林乐瑶
      chen fei|Chén fēi
      consort chen|Consort Chén
      concubine chen|Concubine Chén
      lin yueyao|Lín Yùeyáo
      yueyao|Yùeyáo
      ## niáng niang 娘娘 (madam?)
      niang niang|niángniang

      # Part 5 - Palace adjacent & Nobles (MZ,GZ,SZ,CQ,JR,YJ,YQ,XY,XB,XQ,Zhuo fam)
      ## Méng Zhì 蒙挚/ Méng dàgē 蒙大哥
      meng zhi|Méng Zhì
      meng da ge|Méng dàgē
      ## 大统领 dàtǒnglǐng
      ## --> I *think* these are the chars/pinyin for Méng Zhì's title as commander?
      meng da tong ling|Méng dàtǒnglǐng
      ## Gāo Zhàn 高湛 / Gāo gōng-gong 高公公
      gao zhan|Gāo Zhàn
      gao gong gong|Gāo gōnggong
      ## Shĕn Zhūi 沈追 /Shĕn dà ren 沈大人 (minister Shen)
      shen zhui|Shĕn Zhūi
      shen da ren|Shĕn dàren
      ## Cài Quán 蔡荃 / Cài dà ren 蔡大人 (minister Cai)
      cai quan|Cài Quán
      cai da ren|Cài dàren

      # Nobles
      ## Yán Yù Jīn言豫津
      yan yu jin|Yán Yùjīn
      yu jin|Yùjīn

      # Marquis Yán Qùe 言阙- Yán hóuyé 言侯爷
      yan que|Yán Qùe
      yan hou ye|Yán hóuyé
      hou ye|hóuyé
      ## Xiāo Jǐng Ruì 萧景睿
      xiao jing rui|Xiāo Jǐngruì
      jing rui|Jǐngruì
      ## Marquis Xiè Yù 谢玉  / Níng Guó Hóu 宁国侯 (Marquis of Ning)
      xie yu|Xiè Yù
      ning guo hou|Níng guóhóu
      marquis of ning|Marquis of Níng
      xie manor|Xiè Manor
      ## Xiè Bì 谢弼
      xie bi|Xiè Bì
      ## Xiè Qí 谢绮
      xie qi|Xiè Qí
      ## Yŭ Wén Niàn 宇文念
      yu wen nian|Yŭwén Niàn
      ## Prince Yŭ Wén Xuān 宇文暄
      yu wen xuan|Yŭwén Xuān
      ## Yŭ Wén Lín 宇文霖
      yu wen lin|Yŭwén Lín

      # Tiān Quán Shān Zhuāng 天泉山庄 (Tian Quan Manor)
      tian quan shan zhuang|Tiān Quán Shānzhuāng
      tian quan|Tiān Quán
      ## Zhuó Dĭngfēng 卓鼎风
      zhuo ding feng|Zhuó Dĭngfēng
      ## Zhuó fū ren Madam Zhuó  卓夫人
      zhuo fu ren|Zhuó fūren
      madam zhuo|Madam Zhuó
      ## Zhuó Qīng Yáo 卓青遥
      zhuo qing yao|Zhuó Qīngyáo

      # Part 6 - Others (XJ,XD,XC,XQ,Banruo,Hua ladies, Locations)
      # Xuán Jìng Sī 悬镜司 (Xuan Jing Bureau)
      xuan jing si|Xuánjìng Sī
      xuan jing|Xuánjìng
      ## Xià Jiāng 夏江
      xia jiang|Xià Jiāng
      ## Xià Dōng 夏冬/Dōng jiě 冬姐
      xia dong|Xià Dōng
      dong jie|Dōng jiě
      ## Xià Chūn 夏春
      xia chun|Xià Chūn
      ## Xià Qiū 夏秋
      xia qiu|Xià Qiū
      ## Bonus: The Legend of XiaXia
      xia xia|Xià Xià

      # the Huá
      ## Huá Zú 滑族 (Zú is race/nationality)
      hua zu|Huá Zú
      hua|Huá
      ## Qín Bān Ruò 秦般若
      qin ban ruo|Qín Bānruò
      ban ruo|Bānruò
      ## Sì Jiĕ 四姐 (4th sister) /  Jùn Niáng 隽娘
      si jie|Sì Jiĕ
      jun niang|Jùn Niáng
      ## Princess Xuán Jī 璇玑公主 (Xuánjī gōngzhǔ)
      princess xuan ji|Princess Xuánjī
      xuan ji gong zhu|Xuánjī gōngzhǔ
      xuan ji|Xuánjī
      ## Princess Líng Lóng 玲珑公主
      princess ling long|Princess Línglóng
      ling long gong zhu|Línglóng gōngzhǔ
      ling long|Línglóng
      gong zhu|Gōngzhǔ

      # Locations:
      ## Méi Lĭng 梅岭 / Mei Cliff
      mei ling|Méilĭng
      ## Láng Yá Gé 琅琊阁(Lang Ya Hall) / Láng Yá Shān 琅琊山 (Lang ya Mountain)
      lang ya ge|Lángyá Gé
      lang ya shan|Lángyá Shān
      lang ya|Lángyá
      ## Láng Zhōu
      lang zhou|Láng Zhōu
      ## Dà Liáng 大梁
      da liang|Dà Liáng
      ## Jīn Líng 金陵
      jin ling|Jīnlíng
      ## Xuĕ Lú 雪庐
      xue lu|Xuĕ Lú
      ## Miào Yīn Fáng 妙音坊 (Miao Yin Court)
      miao yin fang|Miàoyīn Fáng
      miao yin|Miàoyīn
      ## Hóng Xiù Zhāo  红袖招
      hong xiu zhao|Hóng Xiù Zhāo
      ## Luó Shì Jiē 螺市街 (Luóshì street)
      luo shi jie|Luóshì Jiē
      luo shi|Luóshì
      ## Zhĭ Luó Gōng 芷萝宫 (zhiluo palace)
      zhi luo gong|Zhĭluó Gōng
      zhi luo palace|Zhĭluó Palace
      ## Jiǔān Shān 九安山 (Jiǔān mountain--where the hunting palace was)
      jiu an shan|Jiǔān Shān
      jiu an|Jiǔān
      ## Yào Wáng Gǔ 药王谷 (Yàowáng Valley)
      yao wang gu|Yàowáng Gǔ
      yao wang valley|Yàowáng Valley
      ## Yún Nán 云南 (province mu nihuang is from)
      yun nan|Yúnnán
      ## Dōng Hăi 东海 (East China Sea?)
      dong hai|Dōng Hăi
      ## Nán Chŭ 南楚 / Southern Chŭ (country that borders yunnan)
      nan chu|Nán Chŭ
      southern chu|Southern Chŭ
      ## Dà Yú 大渝
      da yu|Dà Yú
      ## Bĕi Yàn 北燕
      bei yan|Bĕi Yàn
      ## Yè Qín
      ye quin|Yè Qín
      ## Jiāng Hú 江湖
      jiang hu|Jiānghú

      # A few misc partial names and titles to try to catch partial matches
      ## Lín Shū 林殊 / Lìn Chén 蔺晨
      lin|[Lín (Shū) or Lìn (Chén)]
      shu|Shū
      chen|Chén
      ## Méi Cháng Sū 梅长苏
      mei|Méi
      ## Cài Quán 蔡荃 / Cài dà ren 蔡大人 (minister Cai)
      da ren|dàren
      ## Gāo Zhàn 高湛 / Gāo gōng-gong 高公公
      gong gong|gōnggong
      ## Yuè gùi fēi 越贵妃 (Noble Consort Yue)
      gui fei|gùifēi
      ## Fēi Liú 飞流 and consort (妃) are both "fēi" so we cheat a little here
      fei|Fēi
      ## Zhuó fū ren Madam Zhuó  卓夫人
      fu ren|fūren
      ## I *think* guniang is this --> 姑娘?
      gu niang|gūniang
      ## sibling relations
      da ge|dàgē
      ge ge|gēge
      ge|gē
      jie jie|jiějie
      jie|jiě

      # Conflicts:
      ## Yán hòu 言后 (Empress Yan)
      ## (conflicts with Marquis Yán (Yán hóuyé 言侯爷), so move to the end)
      yan hou|Yán hòu
      `;
}
})();
