var EntitySchema = require("typeorm").EntitySchema;

const {USER_STATES,ACCOUNT_TYPE} = require('../constants/states')
module.exports = new EntitySchema({
    name: "User",
    tableName: "user", 
    columns: {
        idUser: {
            name:'id_user',
            primary: true,
            type: "int",
            generated: true,
        },
        document: {
            name:"document",
            type: "varchar",
            length:255,
            nullable:false,
        },
        accountType:{
            name:'account_type',
            type:'enum',
            default:ACCOUNT_TYPE.local,
            enum:ACCOUNT_TYPE,
            nullable:false,
        },
        email:{
            name:'email',
            type:"varchar",
            length:255,
            nullable:false,
        }
        ,
        password:{
            name:'password',
            type:'varchar',
            length:50
        },
        fullName:{
            name:"full_name",
            type:"varchar",
            length:255,
            nullable:false,
        },
        address:{
            name:"address",
            type:"varchar",
            length:255,
            nullable:false,
        }
        ,
        phoneNumber:{
            name:"phone_number",
            type:'varchar',
            length:10,
            nullable:true
        },
        state:{
            type:"enum",
            default:USER_STATES.CREATED,
            enum:USER_STATES,
            nullable:false,
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

});