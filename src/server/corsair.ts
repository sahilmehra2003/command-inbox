import { env } from "@/config/env.config";
import { Pool } from 'pg';
import { createCorsair } from 'corsair';
import { gmail } from "@corsair-dev/gmail";
import { googlecalendar } from "@corsair-dev/googlecalendar";


const pool=new Pool({
    connectionString:env.DATABASE_URL
});

export const corsair=createCorsair({
    plugins:[
        gmail({authType:"oauth_2"}),
        googlecalendar({authType:"oauth_2"}),
    ],
    database:pool,
    kek:env.CORSAIR_KEK,
    multiTenancy:true
})