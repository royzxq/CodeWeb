# -*- coding: utf-8 -*-
import scrapy
from leetSpider.items import LeetspiderItem
from scrapy.selector import Selector
import string
from tool import replace

class LeetcodeSpider(scrapy.Spider):
    name = "leetcode"
    allowed_domains = ["leetcode.com"]
    start_urls = [
        'https://leetcode.com/problemset/algorithms/'
    ]

    def parse(self, response):
        sel = Selector(response)
        prob_lists = sel.xpath("//table[@id='problemList']/tbody/tr")
        items = []

        for prob in prob_lists:
            item = LeetspiderItem()

            title = prob.xpath('td/a/text()').extract()
            link = prob.xpath('td/a/@href').extract()
            # link = "https://leetcode.com" + ''.join(link)
            # title = ''.join(title)
            link = response.urljoin(''.join(link))
            difficulty = prob.xpath('td[@value]/text()').extract()
            item['title'] = title[0]
            item['link'] = link
            item['difficulty'] = difficulty[0]
            yield scrapy.Request(link, callback=self.parse_content, meta={'item':item})
            
            # item['content'] = request.body
            # items.append(item)
        # return items

    def parse_content(self, response):
        sel = Selector(response)
        content = sel.xpath("//div[@class='question-content']/p")
        item = response.meta['item']
        # item = {}
        item['content'] = []
        for des in content:
            text = des.extract()
            if 'Credits' in text:
                continue
            if text:
                text = replace(text)
                if text:
                    item['content'].append(text)
        # response.meta['content'] = item['content']
        return item


