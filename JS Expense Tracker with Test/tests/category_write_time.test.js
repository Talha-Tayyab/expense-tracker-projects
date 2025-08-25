const {generateCategoryId} = require('../src/utils/category');
describe ('generateCatergorryId() - write-time test', ()=> {
    test('turns " Food and Drink " into "food-and-drink"', () => {
        expect (generateCategoryId (' Food and Drink ' )).toBe('food-and-drink');
    });
    });
