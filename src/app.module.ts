import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import configuration from './configuration/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuModule } from './menu/menu.module';
import { PlanWorkModule } from './plan-work/plan-work.module';
import { KpisModule } from './kpis/kpis.module';
import { EnteModule } from './ente/ente.module';
import { CodeEthicsModule } from './code-ethics/code-ethics.module';
import { EthicsCommitteModule } from './ethics-committe/ethics-committe.module';
import { IntegrityRulesModule } from './integrity-rules/integrity-rules.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],    
    }),
    GraphQLModule.forRoot({ 
      autoSchemaFile: 'schema.gql',
    }),
    MongooseModule.forRoot(process.env.MONGO_CNN,{dbName: 'oic'}),
    AuthModule,
    UsersModule,
    MenuModule,
    PlanWorkModule,
    KpisModule,
    EnteModule,
    CodeEthicsModule,
    EthicsCommitteModule,
    IntegrityRulesModule,
    
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
