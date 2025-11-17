"use client";
import { useEffect } from "react";
import { DefaultApi } from "finnhub";

export default function StockSymbols(){
    useEffect(() => {
        const finnhubClient = new DefaultApi(
            "d47244hr01qh8nnaoebgd47244hr01qh8nnaoec0"
        )
        finnhubClient.stockSymbols("US" , {}, (data)=>{
            console.log(data)
        })
    }, [])
    return(
        <div>finhub</div>
    )
}