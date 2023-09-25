export const demodata = {
    columns:[
        {
            field: "id",
            headerName: "ID",
            dataGeneratorUniquenessEnabled: true,
            width: 200,
            editable: true,
            groupable: false,
            aggregable: false,
        },
        {
            field: "sr",
            headerName: "Sr #",
            dataGeneratorUniquenessEnabled: true,
            width: 200,
            editable: true,
            groupable: false,
            aggregable: false,
        },
        {
            field: "sender",
            headerName: "Sender",  
            dataGeneratorUniquenessEnabled: true,
            width: 200,
            editable: true,
            groupable: false,
            aggregable: false,
        },
        {
            field: "amount",
            headerName: "Amount",  
            dataGeneratorUniquenessEnabled: true,
            width: 200,
            editable: true,
            groupable: false,
            aggregable: false,  
        },
        {
            field: "date",
            headerName: "Date",  
            dataGeneratorUniquenessEnabled: true,
            width: 200,
            editable: true,
            groupable: false,
            aggregable: false,    
        }

    ],
    rows:[
        {
                        id: 1,
                        sr: 1,
            sender: "user1",
            amount: 100,
            date: "May 03 2023 14:44:24",
        },
        {
                        id: 2,
                        sr: 2,
            sender: "user2",
            amount: 50,
            date: "May 08 2023 14:44:24",
        },
        {
                        id: 3,
                        sr: 3,
            sender: "user1",
            amount: 200,
            date: "May 10 2023 14:44:24",
        },
        {
                        id: 4,
                        sr: 4,
            sender: "user1",
            amount: 90,
            date: "May 11 2023 14:44:24",
        },
        {
                        id: 5,
                        sr: 5,
            sender: "user1",
            amount: 70,
            date: "May 16 2023 14:44:24",
        },
      
  
    ],
    initialState:{
        columns:{
            columnVisibilityModel:{
                id: false,
                avatar: false,
                website: false,
                email: false,
                phone: false,
                username: false,
                city: false,
                company: false,
                position: false,
                lastUpdated: false,
                salary: false,
            }
        }
    }
}