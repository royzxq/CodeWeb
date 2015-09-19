# -*- coding: utf-8 -*-
import scrapy
import string
from leetSpider.items import LeetspiderItem
from scrapy.selector import Selector
from tool import replace

diff = {}
diff["1"] = "Easy"
diff["2"] = "Medium"
diff["3"] = "Hard"

class LintcodeSpider(scrapy.Spider):
    name = "lintcode"
    allowed_domains = ["lintcode.com"]
    start_urls = [
        'http://www.lintcode.com/en/problem'
    ]

    def parse(self, response):
        sel = Selector(response)
        prob_lists = sel.xpath("//div[@id='problem-list']/div[@class='list-group list']/a")
        items = []
        for prob in prob_lists:
            item = LeetspiderItem()
            link = prob.xpath('@href').extract()
            title = prob.xpath("span[@class='m-l-sm title']/text()").extract()
            difficulty = prob.xpath("span[@class='raw_difficulty hide']/text()").extract()
            link = response.urljoin(''.join(link))
            item['title'] = title[0]
            item['difficulty'] = diff[str(difficulty[0])]
            item['link'] = link
            item['source'] = self.name
            yield scrapy.Request(link, callback=self.parse_content, meta={'item':item})



    def parse_content(self, response):
        content = response.xpath('//div[@id="problem-detail"]/div')
        item = response.meta['item']
        des = content[2].xpath('p').extract()[0]
        des = replace(des)
        item["content"] = list()
        if des:
            item["content"].append(des)
        return item