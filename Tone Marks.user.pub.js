// ==UserScript==
// @name         Tone Marks
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Cathalinaheart
// @match        https://archiveofourown.org/*
// @updateURL    https://raw.githubusercontent.com/Cathalinaheart/AO3-Tone-Marks/main/Tone%20Marks.user.pub.js
// @downloadURL  https://raw.githubusercontent.com/Cathalinaheart/AO3-Tone-Marks/main/Tone%20Marks.user.pub.js
// @grant        none
// ==/UserScript==
//function from https://stackoverflow.com/questions/18474497/replace-text-in-a-website
(function() {
    'use strict';

    function replaceTextOnPage(from, to){
  getAllTextNodes().forEach(function(node){
    node.nodeValue = node.nodeValue.replace(new RegExp(quote(from), 'gi'), to);
  });

  function getAllTextNodes(){
    var result = [];

    (function scanSubTree(node){
      if(node.childNodes.length) {
        for(var i = 0; i < node.childNodes.length; i++) {
          scanSubTree(node.childNodes[i])};}
      else if(node.nodeType == Node.TEXT_NODE) {
        result.push(node)};
    })(document);

    return result;
  }

  function quote(str){
    return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
  }
}

//General Terms
replaceTextOnPage('Gongzi', 'gōngzī');
replaceTextOnPage('Guqin', 'gǔqín');
replaceTextOnPage('da ge', 'dàgē');
replaceTextOnPage('-Ge', '-gē');
replaceTextOnPage('Gege', 'gēge');
replaceTextOnPage('xiong zhang', 'Xiōngzhǎng');
replaceTextOnPage('-Xiong', '-xiōng');
replaceTextOnPage('Jiejie', 'jiějiě');
replaceTextOnPage('Shijie', 'shījiě');
replaceTextOnPage('-Jie', '-jiě');
replaceTextOnPage('qiankun dai', 'qiánkūn dài');
replaceTextOnPage('qiankun', 'qiánkūn');
replaceTextOnPage('hanshi', 'Hánshì');
replaceTextOnPage('mingshi', 'Míngshì');
replaceTextOnPage('yashi', 'Yǎshì');
replaceTextOnPage('lanshi', 'lanshi');
replaceTextOnPage('dage', 'dàgē');
replaceTextOnPage('ge ge', 'gēge');
replaceTextOnPage('ge', 'gē');
replaceTextOnPage('jie jie', 'jiějie');
replaceTextOnPage('jie', 'jiě');


const tags = document.getElementsByClassName("tag");

for (let i = 0; i < tags.length; i++) {
    if (tags[i].innerHTML.includes('Untamed') || tags[i].innerHTML.includes('Módào')){
        replaceTextOnPage('wei ying', 'Wèi Yīng');
        replaceTextOnPage('wei wuxian', 'Wèi Wúxiàn');
        replaceTextOnPage('wy', 'Wèi Yīng');
        replaceTextOnPage('wwx', 'Wèi Wúxiàn');
        replaceTextOnPage('a xian', 'Ā-Xiàn');
        replaceTextOnPage('young master wei', 'Young Master Wèi');
        replaceTextOnPage('yiling patriarch', 'Yílíng Patriarch');
        replaceTextOnPage('yiling laozu', 'Yílíng Lǎozǔ');
        replaceTextOnPage('yiling', 'Yílíng');
        replaceTextOnPage('laozu', 'Lǎozǔ');
        replaceTextOnPage('wei', 'Wèi');
        replaceTextOnPage('wuxian', 'Wúxiàn');
        replaceTextOnPage('jiang cheng', 'Jiāng Chéng');
        replaceTextOnPage('a cheng', 'Ā-Chéng');
        replaceTextOnPage('sandu shengshou', 'Sāndú Shèngshǒu');
        replaceTextOnPage('sandu', 'Sāndú');
        replaceTextOnPage('shengshou', 'Shèngshǒu');
        replaceTextOnPage('wanyin', 'Wǎnyín');
        replaceTextOnPage('yu ziyuan', 'Yú Zǐyuān');
        replaceTextOnPage('yu furen', 'Yú fūrén');
        replaceTextOnPage('madame yu', 'Madame Yú');
        replaceTextOnPage('zi zhizhu', 'Zǐ Zhīzhū');
        replaceTextOnPage('ziyuan', 'Zǐyuān');
        replaceTextOnPage('jiang fengmian', 'Jiāng Fēngmián');
        replaceTextOnPage('fengmian', 'Fēngmián');
        replaceTextOnPage('jiang yanli', 'Jiāng Yànlí');
        replaceTextOnPage('yanli', 'Yànlí');
        replaceTextOnPage('a li', 'Ā-Lí');
        replaceTextOnPage('zidian', 'Zǐdiàn');
        replaceTextOnPage('chenqing', 'Chénqíng');
        replaceTextOnPage('suibian', 'Suíbiàn');
        replaceTextOnPage('sect leader jiang', 'Sect Leader Jiāng');
        replaceTextOnPage('yunmeng jiang shi', 'Yúnmèng Jiāng Shì');
        replaceTextOnPage('yunmeng', 'Yúnmèng');
        replaceTextOnPage('jiang', 'Jiāng');
        replaceTextOnPage('jin zixuan', 'Jīn Zixuān');
        replaceTextOnPage('zixuan', 'Zixuān');
        replaceTextOnPage('jin ling', 'Jīn Líng');
        replaceTextOnPage('a ling', 'Ā-Líng');
        replaceTextOnPage('jin rulan', 'Jīn Rúlán');
        replaceTextOnPage('rulan', 'Rúlán');
        replaceTextOnPage('jin guangshan', 'Jīn Guāngshàn');
        replaceTextOnPage('jin guangyao', 'Jīn Guāngyáo');
        replaceTextOnPage('guangyao', 'Guāngyáo');
        replaceTextOnPage('meng yao', 'Mèng Yáo');
        replaceTextOnPage('a yao', 'Ā-Yáo');
        replaceTextOnPage('mo xuanyu', 'Mò Xuányǔ');
        replaceTextOnPage('xuanyu', 'Xuányǔ');
        replaceTextOnPage('senior mo', 'Senior Mò');
        replaceTextOnPage('mian mian', 'Miánmián');
        replaceTextOnPage('luo qingyang', 'Luó Qīngyáng');
        replaceTextOnPage('qingyang', 'Qīngyáng');
        replaceTextOnPage('jin zixun', 'Jīn Zixūn');
        replaceTextOnPage('zixun', 'Zixūn');
        replaceTextOnPage('jin lin tower', 'Jīnlín Tower');
        replaceTextOnPage('jin lin tai', 'Jīnlín Tái');
        replaceTextOnPage('langling jin shi', 'Lánlíng Jīn Shì');
        replaceTextOnPage('langling jin', 'Lánlíng Jīn');
        replaceTextOnPage('lanling', 'Lánlíng');
        replaceTextOnPage('jin', 'Jīn');
        replaceTextOnPage('lan zhan', 'Lán Zhàn');
        replaceTextOnPage('zhan', 'Zhàn');
        replaceTextOnPage('lan wang ji', 'Lán Wàngjī');
        replaceTextOnPage('lan wangji', 'Lán Wàngjī');
        replaceTextOnPage('lwj', 'Lán Wàngjī');
        replaceTextOnPage('wangji', 'Wàngjī');
        replaceTextOnPage('hanguang jun', 'Hánguāng-jūn');
        replaceTextOnPage('master lan', 'Master Lán');
        replaceTextOnPage('lan qiren', 'Lán Qǐrén');
        replaceTextOnPage('qiren', 'Qǐrén');
        replaceTextOnPage('lan huan', 'Lán Huàn');
        replaceTextOnPage('lan xichen', 'Lán Xīchén');
        replaceTextOnPage('xichen', 'Xīchén');
        replaceTextOnPage('zewu jun', 'Zéwú-jūn');
        replaceTextOnPage('lan yuan', 'Lán Yuàn');
        replaceTextOnPage('a yuan', 'Ā-Yuàn');
        replaceTextOnPage('lan sizhui', 'Lán Sīzhuī');
        replaceTextOnPage('sizhui', 'Sīzhuī');
        replaceTextOnPage('wen yuan', 'Wēn Yuàn');
        replaceTextOnPage('lan jingyi', 'Lán Jǐngyí');
        replaceTextOnPage('jingyi', 'Jǐngyí');
        replaceTextOnPage('caiyi town', 'Cǎiyī Town');
        replaceTextOnPage('caiyi cheng', 'Cǎiyī Chéng');
        replaceTextOnPage('jingshi', 'Jìngshì');
        replaceTextOnPage('bichen', 'Bìchén');
        replaceTextOnPage('gusu lan shi', 'Gūsū Lán Shì');
        replaceTextOnPage('gusu lan', 'Gūsū Lán');
        replaceTextOnPage('gusu', 'Gūsū');
        replaceTextOnPage('nie huaisang', 'Niè Huáisāng');
        replaceTextOnPage('huaisang', 'Huáisāng');
        replaceTextOnPage('nie mingjue', 'Niè Míngjué');
        replaceTextOnPage('mingjue', 'Míngjué');
        replaceTextOnPage('nie zonghui', 'Niè Zōnghuī');
        replaceTextOnPage('zonghui', 'Zōnghuī');
        replaceTextOnPage('qinghe nie shi', 'Qīnghé Niè Shì');
        replaceTextOnPage('qinghe nie', 'Qīnghé Niè');
        replaceTextOnPage('qinghe', 'Qīnghé');
        replaceTextOnPage('nie', 'Niè');
        replaceTextOnPage('Wen Ning', 'Wēn Níng');
        replaceTextOnPage('Wen Qionglin', 'Wēn Qiónglín');
        replaceTextOnPage('Qionglin', 'Qiónglín');
        replaceTextOnPage('Gui Jiangjun', 'Guǐ jiāngjūn');
        replaceTextOnPage('Wen Qing', 'Wēn Qíng');
        replaceTextOnPage('Wen Ruohan', 'Wēn Ruòhán');
        replaceTextOnPage('Wen Chao', 'Wēn Cháo');
        replaceTextOnPage('Wen Xu', 'Wēn Xù');
        replaceTextOnPage('Wen Zhu Liu', 'Wēn Zhúliú');
        replaceTextOnPage('Zhu Liu', 'Zhúliú');
        replaceTextOnPage('Qishan Wen Shi', 'Qíshān Wēn Shì');
        replaceTextOnPage('Qishan Wen', 'Qíshān Wēn');
        replaceTextOnPage('Qishan', 'Qíshān');
        replaceTextOnPage('Da Fan Wen', 'Dàfàn Wēn');
        replaceTextOnPage('Wen', 'Wēn');
        replaceTextOnPage('Song Lan', 'Sòng Lán');
        replaceTextOnPage('Song Zichen', 'Sòng Zichēn');
        replaceTextOnPage('Zichen', 'Zichēn');
        replaceTextOnPage('Fuxue', 'Fúxuě');
        replaceTextOnPage('Xiao Xingchen', 'Xiǎo Xīngchén');
        replaceTextOnPage('Xingchen', 'Xīngchén');
        replaceTextOnPage('Shuanghua', 'Shuānghuá');
        replaceTextOnPage('Xue Yang', 'Xuē Yáng');
        replaceTextOnPage('Baoshan Sanren', 'Bàoshān Sànrén');
        replaceTextOnPage('Cangse Sanren', 'Cángsè Sànrén');
        replaceTextOnPage('Zangse Sanren', 'Zángsè Sànrén');
        replaceTextOnPage('Ouyang Zizhen', 'Ōuyáng Zizhēn');
        replaceTextOnPage('Yi City', 'Yì City');
        replaceTextOnPage('Yi Cheng', 'Yì Chéng');
        replaceTextOnPage('Da Fan Mountain', 'Dàfàn Mountain');
        replaceTextOnPage('Da Fan Shan', 'Dàfàn shān');
}
    if (tags[i].innerHTML.includes('Guardian')){
        replaceTextOnPage('Chief Zhao', 'Chief Zhào');
        replaceTextOnPage('Zhao Yun Lan', 'Zhào Yúnlán');
        replaceTextOnPage('Zhao YunLan', 'Zhào Yúnlán');
        replaceTextOnPage('Yunlan', 'Yúnlán');
        replaceTextOnPage('Kunlun', 'Kūnlún');
        replaceTextOnPage('Shen Wei', 'Shěn Wēi');
        replaceTextOnPage('Professor Shen', 'Professor Shěn');
        replaceTextOnPage('Hei Pao Shi', 'Hēi Páo Shǐ');
        replaceTextOnPage('Xiao Wei', 'Xiǎo Wēi")');
        replaceTextOnPage('Zhao Xin Ci', 'Zhào Xīncí');
        replaceTextOnPage('Guo Ying', 'Guō Yīng');
        replaceTextOnPage('Guo Chang Cheng', 'Guō Chángchéng');
        replaceTextOnPage('Zhu Hong', 'Zhù Hóng');
        replaceTextOnPage('Da Qing', 'Dà Qìng');
        replaceTextOnPage('Chu Shu Zhi', 'Chǔ Shùzhī');
        replaceTextOnPage('Wang Zheng', 'Wāng Zhēng');
        replaceTextOnPage('Lin Jing', 'Lín Jìng');
        replaceTextOnPage('Sang Zan', 'Sāng Zàn');
        replaceTextOnPage('Old Li', 'Old Lǐ');
        replaceTextOnPage('Lao Li', 'Lǎo Lǐ');
        replaceTextOnPage('Ye Zun', 'Yè Zūn');
        replaceTextOnPage('Zhu Jiu', 'Zhú jiǔ');
        replaceTextOnPage('Ya Qing', 'Yā Qīng');
        replaceTextOnPage('Sha Ya', 'Shā Yǎ');
        replaceTextOnPage('Wang Xiang Yang', 'Wáng Xiàngyáng');
        replaceTextOnPage('Li Qian', 'Lǐ Qiàn');
        replaceTextOnPage('Cheng Xin Yan', 'Chéng Xīnyán');
        replaceTextOnPage('Ou Yang Zhen', 'Ōuyáng Zhēn');
        replaceTextOnPage('Professor Zhou', 'Professor Zhōu');
        replaceTextOnPage('Teacher Zhou', 'Teacher Zhōu');
        replaceTextOnPage('Zhou Jiao Shou', 'Zhōu-jiàoshòu');
        replaceTextOnPage('Wu Tian En', 'Wú Tiān\'ēn');
        replaceTextOnPage('Wu Xiao Jun', 'Wú Xiǎojūn');
        replaceTextOnPage('si shu', 'Sì Shū');
        replaceTextOnPage('Ying Chun', 'Yíng Chūn');
        replaceTextOnPage('Cong Bo', 'Cóng Bō');
        replaceTextOnPage('Gao Jing Feng', 'Gāo Jìngfēng');
        replaceTextOnPage('An Bai', 'Ān Bǎi');
        replaceTextOnPage('Ye Huo', 'Yě Huǒ');
        replaceTextOnPage('Da Ji', 'Dà Jí');
        replaceTextOnPage('Bai Su Xia', 'Bái Sùxiá');
        replaceTextOnPage('Shen Xi', 'Shěn Xī');
        replaceTextOnPage('Zhang Shi', 'Zhāng Shī');
        replaceTextOnPage('Chu Nian Zhi', 'Chǔ Niànzhī');
        replaceTextOnPage('Guo Chang Jiang', 'Guō Chángjiāng');
        replaceTextOnPage('Guo Xiong', 'Guō Xióng');
        replaceTextOnPage('Long Cheng', 'Lóng Chéng');
        replaceTextOnPage('Long City', 'Lóng City');
        replaceTextOnPage('Hai Xing', 'Hǎixīng');
        replaceTextOnPage('Di Xing Ren', 'Dixīngrén');
        replaceTextOnPage('Di Xing', 'Dixīng');
        replaceTextOnPage('Ya Shou', 'Yàshòu');
        replaceTextOnPage('Zei Qiu', 'Zéiqiú');
        replaceTextOnPage('She Zheng Guan', 'Shèzhènggūan');}
   if (tags[i].innerHTML.includes('Nirvana')){
       replaceTextOnPage('lang ya bang', 'Láng Yá Băng');
       replaceTextOnPage('mei chang su', 'Méi Chángsū');
       replaceTextOnPage('chang su', 'Chángsū');
       replaceTextOnPage('su zhe', 'Sū Zhé');
       replaceTextOnPage('lin shu', 'Lín Shū');
       replaceTextOnPage('xiao shu', 'xiăo-Shū');
       replaceTextOnPage('zong zhu', 'Zōngzhŭ');
       replaceTextOnPage('su xian sheng', 'Sū xiānsheng');
       replaceTextOnPage('sir su', 'Sir Sū');
       replaceTextOnPage('su manor', 'Sū Manor');
       replaceTextOnPage('su gege', 'Sū gēge');
       replaceTextOnPage('mu ni huang', 'Mù Níhuáng');
       replaceTextOnPage('ni huang', 'Níhuáng');
       replaceTextOnPage('mu manor', 'Mù Manor');
       replaceTextOnPage('Níhuáng jun zhu', 'Níhuáng jùnzhŭ');
       replaceTextOnPage('jun zhu', 'Jùnzhŭ');
       replaceTextOnPage('xiao jing yan', 'Xiāo Jĭngyán');
       replaceTextOnPage('jing yan', 'Jĭngyán');
       replaceTextOnPage('jing wang', 'Jìng wáng');
       replaceTextOnPage('prince jing', 'Prince Jìng');
       replaceTextOnPage('jing manor', 'Jìng Manor');
       replaceTextOnPage('dian xia', 'Diànxià');
       replaceTextOnPage('shui niu', 'Shŭiniú');
       replaceTextOnPage('lin chen ge ge', 'Lìn Chén gēge');
       replaceTextOnPage('lin chen', 'Lìn Chén');
       replaceTextOnPage('shao ge zhu', 'Shào Gézhŭ');
       replaceTextOnPage('jiang zuo meng', 'Jiāngzuŏ Méng');
       replaceTextOnPage('jiang zuo', 'Jiāngzuŏ');
       replaceTextOnPage('Fei Liu', 'Fēi Liú');
       replaceTextOnPage('li gang', 'Lí Gāng');
       replaceTextOnPage('zhen ping', 'Zhēn Píng');
       replaceTextOnPage('gong yu', 'Gōng Yŭ');
       replaceTextOnPage('gong gu niang', 'Gōng gūniang');
       replaceTextOnPage('wei zheng', 'Wèi Zhēng');
       replaceTextOnPage('tong lu', 'Tóng Lù');
       replaceTextOnPage('shi san xian sheng', 'Shísān xiānsheng');
       replaceTextOnPage('yan daifu', 'Yàn dàifu');
       replaceTextOnPage('chiyan jun', 'Chìyàn Jūn');
       replaceTextOnPage('chiyan', 'Chìyàn');
       replaceTextOnPage('changlin jun', 'Chánglín Jūn');
       replaceTextOnPage('changlin', 'Chánglín');
       replaceTextOnPage('mu qing', 'Mù Qīng');
       replaceTextOnPage('qing er', 'Qīng-er');
       replaceTextOnPage('lin zie', 'Lín Xiè');
       replaceTextOnPage('fu shuai', 'fùshuài');
       replaceTextOnPage('jin yang', 'Jìnyáng');
       replaceTextOnPage('lin manor', 'Lín Manor');
       replaceTextOnPage('lin family', 'Lín family');
       replaceTextOnPage('nie feng', 'Niè Fēng');
       replaceTextOnPage('nie dage', 'Niè dàgē');
       replaceTextOnPage('nie duo', 'Niè Duó');
       replaceTextOnPage('lie zhan ying', 'Liè Zhànyīng');
       replaceTextOnPage('zhan ying', 'Zhànyīng');
       replaceTextOnPage('qi meng', 'Qī Mĕng');
       replaceTextOnPage('xiao ting sheng', 'Xiāo Tíngshēng');
       replaceTextOnPage('ting sheng', 'Tíngshēng');
       replaceTextOnPage('fo ya', 'Fóyá');
       replaceTextOnPage('xiao xuan', 'Xiāo Xuǎn');
       replaceTextOnPage('bi xia', 'Bìxià');
       replaceTextOnPage('xiao jing yu', 'Xiāo Jĭngyŭ');
       replaceTextOnPage('jing yu', 'Jĭngyŭ');
       replaceTextOnPage('qi wang', 'Qí wáng');
       replaceTextOnPage('prince qi', 'Prince Qí');
       replaceTextOnPage('xiao jing huan', 'Xiāo Jĭnghuán');
       replaceTextOnPage('jing huan', 'Jĭnghuán');
       replaceTextOnPage('yu wang', 'Yù wáng');
       replaceTextOnPage('prince yu', 'Prince Yù');
       replaceTextOnPage('yu manor', 'Yù Manor');
       replaceTextOnPage('xiao jing xuan', 'Xiāo Jĭngxuān');
       replaceTextOnPage('jing xuan', 'Jĭngxuān');
       replaceTextOnPage('xian wang', 'Xiàn wáng');
       replaceTextOnPage('prince xian', 'Prince Xiàn');
       replaceTextOnPage('tai zi', 'Tàizĭ');
       replaceTextOnPage('ji wang', 'Jì wáng');
       replaceTextOnPage('prince ji', 'Prince Jì');
       replaceTextOnPage('jing ning', 'Jĭngníng');
       replaceTextOnPage('tai nai nai', 'Tàinăinai');
       replaceTextOnPage('jing fei', 'Jìng fēi');
       replaceTextOnPage('consort jing', 'Consort Jìng');
       replaceTextOnPage('concubine jing', 'Concubine Jìng');
       replaceTextOnPage('li yang', 'Lìyáng');
       replaceTextOnPage('yue gui fei', 'Yuè gùifēi');
       replaceTextOnPage('consort yue', 'Consort Yuè');
       replaceTextOnPage('concubine yue', 'Concubine Yuè');
       replaceTextOnPage('hui fei', 'Hùi fēi');
       replaceTextOnPage('consort hui', 'Consort Hùi');
       replaceTextOnPage('concubine hui', 'Concubine Hùi');
       replaceTextOnPage('chen fei', 'Chén fēi');
       replaceTextOnPage('consort chen', 'Consort Chén');
       replaceTextOnPage('concubine chen', 'Concubine Chén');
       replaceTextOnPage('lin yueyao', 'Lín Yùeyáo');
       replaceTextOnPage('yueyao', 'Yùeyáo');
       replaceTextOnPage('niang niang', 'niángniang');
       replaceTextOnPage('meng zhi', 'Méng Zhì');
       replaceTextOnPage('meng da ge', 'Méng dàgē');
       replaceTextOnPage('meng da tong ling', 'Méng dàtǒnglǐng');
       replaceTextOnPage('gao zhan', 'Gāo Zhàn');
       replaceTextOnPage('gao gong gong', 'Gāo gōnggong');
       replaceTextOnPage('shen zhui', 'Shĕn Zhūi');
       replaceTextOnPage('shen da ren', 'Shĕn dàren');
       replaceTextOnPage('cai quan', 'Cài Quán');
       replaceTextOnPage('cai da ren', 'Cài dàren');
       replaceTextOnPage('yan yu jin', 'Yán Yùjīn');
       replaceTextOnPage('yu jin', 'Yùjīn');
       replaceTextOnPage('yan que', 'Yán Qùe');
       replaceTextOnPage('yan hou ye', 'Yán hóuyé');
       replaceTextOnPage('hou ye', 'hóuyé');
       replaceTextOnPage('xiao jing rui', 'Xiāo Jǐngruì');
       replaceTextOnPage('jing rui', 'Jǐngruì');
       replaceTextOnPage('xie yu', 'Xiè Yù');
       replaceTextOnPage('ning guo hou', 'Níng guóhóu');
       replaceTextOnPage('marquis of ning', 'Marquis of Níng');
       replaceTextOnPage('xie manor', 'Xiè Manor');
       replaceTextOnPage('xie bi', 'Xiè Bì');
       replaceTextOnPage('xie qi', 'Xiè Qí');
       replaceTextOnPage('yu wen nian', 'Yŭwén Niàn');
       replaceTextOnPage('yu wen xuan', 'Yŭwén Xuān');
       replaceTextOnPage('yu wen lin', 'Yŭwén Lín');
       replaceTextOnPage('tian quan shan zhuang', 'Tiān Quán Shānzhuāng');
       replaceTextOnPage('tian quan', 'Tiān Quán');
       replaceTextOnPage('zhuo ding feng', 'Zhuó Dĭngfēng');
       replaceTextOnPage('zhuo fu ren', 'Zhuó fūren');
       replaceTextOnPage('madam zhuo', 'Madam Zhuó');
       replaceTextOnPage('zhuo qing yao', 'Zhuó Qīngyáo');
       replaceTextOnPage('xuan jing si', 'Xuánjìng Sī');
       replaceTextOnPage('xuan jing', 'Xuánjìng');
       replaceTextOnPage('xia jiang', 'Xià Jiāng');
       replaceTextOnPage('xia dong', 'Xià Dōng');
       replaceTextOnPage('dong jie', 'Dōng jiě');
       replaceTextOnPage('xia chun', 'Xià Chūn');
       replaceTextOnPage('xia qiu', 'Xià Qiū');
       replaceTextOnPage('xia xia', 'Xià Xià');
       replaceTextOnPage('hua zu', 'Huá Zú');
       replaceTextOnPage('hua', 'Huá');
       replaceTextOnPage('qin ban ruo', 'Qín Bānruò');
       replaceTextOnPage('ban ruo', 'Bānruò');
       replaceTextOnPage('si jie', 'Sì Jiĕ');
       replaceTextOnPage('jun niang', 'Jùn Niáng');
       replaceTextOnPage('princess xuan ji', 'Princess Xuánjī');
       replaceTextOnPage('xuan ji gong zhu', 'Xuánjī gōngzhǔ');
       replaceTextOnPage('xuan ji', 'Xuánjī');
       replaceTextOnPage('princess ling long', 'Princess Línglóng');
       replaceTextOnPage('ling long gong zhu', 'Línglóng gōngzhǔ');
       replaceTextOnPage('ling long', 'Línglóng');
       replaceTextOnPage('gong zhu', 'Gōngzhǔ');
       replaceTextOnPage('mei ling', 'Méilĭng');
       replaceTextOnPage('lang ya ge', 'Lángyá Gé');
       replaceTextOnPage('lang ya shan', 'Lángyá Shān');
       replaceTextOnPage('lang ya', 'Lángyá');
       replaceTextOnPage('lang zhou', 'Láng Zhōu');
       replaceTextOnPage('da liang', 'Dà Liáng');
       replaceTextOnPage('jin ling', 'Jīnlíng');
       replaceTextOnPage('xue lu', 'Xuĕ Lú');
       replaceTextOnPage('miao yin fang', 'Miàoyīn Fáng');
       replaceTextOnPage('miao yin', 'Miàoyīn');
       replaceTextOnPage('hong xiu zhao', 'Hóng Xiù Zhāo');
       replaceTextOnPage('luo shi jie', 'Luóshì Jiē');
       replaceTextOnPage('luo shi', 'Luóshì');
       replaceTextOnPage('zhi luo gong', 'Zhĭluó Gōng');
       replaceTextOnPage('zhi luo palace', 'Zhĭluó Palace');
       replaceTextOnPage('jiu an shan', 'Jiǔān Shān');
       replaceTextOnPage('jiu an', 'Jiǔān');
       replaceTextOnPage('yao wang gu', 'Yàowáng Gǔ');
       replaceTextOnPage('yao wang valley', 'Yàowáng Valley');
       replaceTextOnPage('yun nan', 'Yúnnán');
       replaceTextOnPage('dong hai', 'Dōng Hăi');
       replaceTextOnPage('nan chu', 'Nán Chŭ');
       replaceTextOnPage('southern chu', 'Southern Chŭ');
       replaceTextOnPage('da yu', 'Dà Yú');
       replaceTextOnPage('bei yan', 'Bĕi Yàn');
       replaceTextOnPage('ye quin', 'Yè Qín');
       replaceTextOnPage('jiang hu', 'Jiānghú');
       replaceTextOnPage(' lin', '[Lín (Shū) or Lìn (Chén)]');
       replaceTextOnPage('shu', 'Shū');
       replaceTextOnPage('chen', 'Chén');
       replaceTextOnPage('mei', 'Méi');
       replaceTextOnPage('da ren', 'dàren');
       replaceTextOnPage('gong gong', 'gōnggong');
       replaceTextOnPage('gui fei', 'gùifēi');
       replaceTextOnPage('fei', 'Fēi');
       replaceTextOnPage('fu ren', 'fūren');
       replaceTextOnPage('gu niang', 'gūniang');}
}
})();
