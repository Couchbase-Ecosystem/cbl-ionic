import {
    Meta,
    Collection,
} from 'cbl-ionic';

export interface QueryDictionary {
    [key: string]: string;
}

export class QueryGeneratorService {

    static readonly queries: string[] = [
        'Select count(*)',
        'Select *',
        'Select Meta.id, name, price',
        'Select Fields',
        'Select * on Sale',
        'Select Electronics Limit 3 Order By Price',
    ];

    static getQueries(collection: Collection): QueryDictionary[] {
        const dataSource: string = collection.name + "." + collection.scope.name;
        return [
            {
                'Select count(*)': "SELECT COUNT(*) FROM " + dataSource,
            },
            {
                'Select *': "SELECT * FROM " + dataSource
            },
            {
                'Select Meta.id, name, price': "SELECT " +  Meta.id + ", name, price FROM " + dataSource + " WHERE documentType = 'product'",
            },
            {
                'Select Fields': "SELECT id, name, category, price, location, quantity FROM " + dataSource + " WHERE documentType = 'product'",
            },
            {
                'Select * on Sale': "SELECT * FROM " + dataSource + " WHERE isOnSale = true AND documentType = 'product'",
            },
            {
                'Select Electronics Limit 3 Order By Price': "SELECT * FROM " + dataSource + " WHERE category = 'Electronics' AND documentType = 'product' ORDER BY price LIMIT 3",
            },
        ];
    }
}
