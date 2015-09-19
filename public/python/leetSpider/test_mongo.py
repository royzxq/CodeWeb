import pymongo

client = pymongo.MongoClient("mongodb://royzxq:leetcode@ds027489.mongolab.com:27489/leetcode")
db = client['leetcode']
collection = db['item']
title = "test"
test = collection.find({"title":title})
if test:
	collection.update_one({"title":title}, {"$set":{"content":"change content"}})
else:
	collection.insert({"title":title,"content":"new content"})

client.close()