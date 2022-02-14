var EntitySchema = require("typeorm").EntitySchema;
module.exports = new EntitySchema({
    name: "UserToken", 
    tableName: "userToken", 
    columns: {
        id: {
            name:'id',
            primary: true,
            type: "int",
            generated: true,
        },
        authToken: {
            name:"auth_token",
            type: "varchar",
            length:255,
            nullable:false,
        },
    
        lastUsed:{
            name:'lastUsed',
            type:'timestamp',
            nullable:false
        },
        createdAt:{
            name:'created_at',
            type:'timestamp',
            nullable:false
        },
        
        updatedAt:{
            name:'updated_at',
            type:'timestamp',
            nullable:true
        }
    },
    relations: {
        user: {
            target: "User",
            type: "many-to-one",
            joinTable: true,
            cascade: true
        }
    }
});