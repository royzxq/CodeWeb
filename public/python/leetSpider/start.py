from twisted.internet import reactor, defer
import scrapy
from scrapy.crawler import CrawlerRunner
from scrapy.utils.log import configure_logging

from leetSpider.spiders.leetcode import LeetcodeSpider
from leetSpider.spiders.lintcode import LintcodeSpider

configure_logging({'LOG_FORMAT': '%(levelname)s: %(message)s'})
runner = CrawlerRunner()

@defer.inlineCallbacks
def crawl():
	yield runner.crawl(LeetcodeSpider)
	yield runner.crawl(LintcodeSpider)
	reactor.stop()

crawl()
reactor.run()