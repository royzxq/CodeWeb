from twisted.internet import reactor
import scrapy
from scrapy.crawler import CrawlerRunner
from scrapy.utils.log import configure_logging

from leetSpider.spiders.leetcode import LeetcodeSpider
from leetSpider.spiders.lintcode import LintcodeSpider

configure_logging({'LOG_FORMAT': '%(levelname)s: %(message)s'})
runner = CrawlerRunner()

runner.crawl(LeetcodeSpider)
runner.crawl(LintcodeSpider)
d = runner.join()
d.addBoth(lambda _: reactor.stop())
reactor.run() 