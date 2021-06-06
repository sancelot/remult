import { CustomModuleLoader } from './CustomModuleLoader';
let moduleLoader = new CustomModuleLoader('/dist-server/projects');
import * as express from 'express';
import * as cors from 'cors';
import { initExpress } from '@remult/core/server';
import * as fs from 'fs';
//import '../app.module';
import { serverInit } from './server-init';


import { preparePostgresQueueStorage } from '@remult/core/postgres';

import * as compression from 'compression';
import * as forceHttps from 'express-force-https';
import * as jwt from 'express-jwt';
import { Filter, filterOf, ServerContext } from '../../../projects/core';
import { Products } from '../products-test/products';






const d = new Date(2020, 1, 2, 3, 4, 5, 6);
serverInit().then(async (dataSource) => {
    let app = express();
    app.use(jwt({ secret: process.env.TOKEN_SIGN_KEY, credentialsRequired: false, algorithms: ['HS256'] }));
    app.use(cors());
    app.use(compression());
    if (process.env.DISABLE_HTTPS != "true")
        app.use(forceHttps);
    let s = initExpress(app, {
        //       dataProvider:dataSource,
        queueStorage: await preparePostgresQueueStorage(dataSource)
    });

    app.use(express.static('dist/my-project'));
    app.get('/api/noam', async (req, res) => {
        let c = await s.getValidContext(req);
        res.send('hello ' + JSON.stringify(c.user));
    });

    app.use('/*', async (req, res) => {
        console.log(req.path);
        const index = 'dist/my-project/index.html';
        if (fs.existsSync(index)) {
            res.send(fs.readFileSync(index).toString());
        }
        else {
            res.send('No Result' + index);
        }
    });
    let con = new ServerContext(dataSource);
    let p = await con.for(Products).findFirst();

    console.dir(p);

    let port = process.env.PORT || 3001;


  


    app.listen(port);


});




// let a: hasWhere<theClass> = {
//     where: x => x.a.isEqualTo(1)
// }
// let b: hasWhere<theClass> = {
//     where: [x => x.a.isEqualTo(2), a.where]
// }
// class theClass {
//     a: number;
//     b: number;
// }

// export declare type EntityWhereItem<entityType> = ((entityType: filterOf<entityType>) => (Filter | Filter[]));
// export declare type EntityWhere<entityType> = ((entityType: filterOf<entityType>) => (Filter | Filter[])) | EntityWhereItem<entityType>[];

// export interface hasWhere<T> {
//     where: EntityWhere<T>;
// }