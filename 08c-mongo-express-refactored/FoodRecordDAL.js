// we need to require MongoUtil because we want to use the getDB() function
const MongoUtil = require('./MongoUtil');
const COLLECTION="food_records";
const ObjectId = require("mongodb").ObjectId;


async function getFoodRecordById(foodRecordId) {
    // in the refactored function, don't refer to req or res at all
    let foodRecord = await MongoUtil.getDB().collection(COLLECTION).findOne({
        _id:ObjectId(foodRecordId)
    });
    return foodRecord;
}

async function addNewFoodRecord(foodRecordName, calories, tags) {
   
    const result = await MongoUtil.getDB().collection(COLLECTION).insertOne({
        "foodRecordName": foodRecordName,
        "calories": calories,
        "tags": tags
    })
    return result;
}

module.exports = {
    getFoodRecordById, addNewFoodRecord
}