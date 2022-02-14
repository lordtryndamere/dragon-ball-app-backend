var EntitySchema = require("typeorm").EntitySchema;

const {USER_STATES,} = require('../constants/states')
module.exports = new EntitySchema({
    name: "Drugs",
    tableName: "drugs", 
    columns: {
        idDrug: {
            name:'id_drug',
            primary: true,
            type: "int",
            generated: true,
        },
        nit: {
            name:"nit",
            type: "varchar",
            length:30,
            nullable:false,
        },
        img:{
            name:'img',
            type:'varchar',
            length:350,
            nullable:false
        },
        phone:{
            name:'phone',
            type:"varchar",
            length:15,
            nullable:false,
        },
        hoursAttention:{
            name:'hours_attention',
            type:'varchar',
            length:100,
            nullable:false
        },
        name:{
            name:"name",
            type:"varchar",
            length:255,
            nullable:false,
        },
        latitude:{
            name:"latitude",
            type:"varchar",
            length:255,
            nullable:false,
        }
        ,
        longitude:{
            name:"longitude",
            type:'varchar',
            length:255,
            nullable:false
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