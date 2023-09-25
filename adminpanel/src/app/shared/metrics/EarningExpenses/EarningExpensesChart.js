import { investandeearning } from 'backendServices/ApiCalls';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import {Area, AreaChart, ResponsiveContainer, Tooltip, XAxis} from 'recharts';

const EarningExpensesChart = ({activeChart}) => {

    const topChart = activeChart;
    const bottomChart = activeChart === "earning" ? "expense" : "earning";
    const topChartColor = activeChart === "earning" ? "#F43B86" : "#2D46B9";
    const bottomChartColor = activeChart === "earning" ? "#2D46B9" : "#F43B86";
    const [chartData, setchartData] = useState('')
    const [isLoading, setIsLoading] = React.useState(true)

    function getChartData(){
        investandeearning((response) => {
            if(response?.data?.status === "success")
            {
                setchartData(response?.data?.data)
                setIsLoading(false)

            }
            else{
                setIsLoading(false)
            }
            
        }, (error) => {
            console.log(error?.response?.data);
        })
    }

    useEffect(() => {
        getChartData()
    }, [])
    
    const crypto = {
        revenueSummary: chartData?.entries,
        
        // revenueSummary: [
        //     {
        //         "earning": "20",
        //         "expense": "0",
        //         "month": "Feb"
        //       },
        //       {
        //         "earning": "1636",
        //         "expense": "1950",
        //         "month": "May"
        //       },
        //       {
        //         "earning": "20",
        //         "expense": "0",
        //         "month": "Dec"
        //       }
        // ],
    };
    
    if(isLoading)
    {
        return <div>Loading...</div>
    }
    return (
        <ResponsiveContainer height={152}>
            <AreaChart data={crypto.revenueSummary} margin={{top: 0, right: 20, left: 20, bottom: 0}}>
                <Tooltip
                    content={({active, label, payload}) => {
                        return active ? (
                            <div style={{color: "#fff"}}>
                                {payload.map((row, index) => {
                                    return (
                                        <div key={index} className={"mb-1"}>
                                            <div style={{
                                                color: row.color,
                                                fontSize: 8,
                                                letterSpacing: 2,
                                                textTransform: 'uppercase'
                                            }}>
                                                {(row.name)}
                                            </div>
                                            <div style={{
                                                color: row.color
                                            }}
                                            >{row.value}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : null;
                    }}
                    wrapperStyle={{
                        background: 'rgba(255,255,255,0.9)',
                        borderRadius: 4,
                        padding: '5px 8px',
                        fontWeight: 500,
                        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
                    }}
                />
                <XAxis tickLine={false} dataKey="month" axisLine={false}/>
                <Area dataKey={bottomChart} stackId="2" stroke={bottomChartColor} fillOpacity={.5} strokeOpacity={.3}
                      fill={bottomChartColor}/>
                <Area dataKey={topChart} stackId="1" stroke={topChartColor} fillOpacity={.8} strokeOpacity={.3}
                      fill={topChartColor}/>
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default EarningExpensesChart;
