const puppeteer = require('puppeteer')
var fs = require('fs');

async function getBfroData(){
    try{
        const URL="http://www.bfro.net/GDB/default.asp"
        const browser = await puppeteer.launch()

        const page = await browser.newPage()
		await page.goto(URL)

        //var values = await page.$$eval("table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr ", elements=> elements.map(item=>item.textContent))
        
        //Gets every table element
        const data = await page.evaluate(() => {
            const tds = Array.from(document.querySelectorAll('table > tbody > tr > td > table tr td'))
            return tds.map(td => td.innerText)
          });
          
          //Filters all unecessary content from the results
        var values= data.filter((element) => {
            return element.includes('-')&&element.length>15
        })

        //Gets rid of table header information
        values.forEach((string, index) => {
            if(string.includes("State"))
                values[index] = string.substring(51)
            else if(string.includes("Province"))
                values[index] = string.substring(54)
            else
                values[index] = string.substring(60)
        });

          //console.log(values[0])

        await browser.close()
        
        //Writes results to text file
        await fs.writeFileSync('./bfro.txt',values.join('\n'));

    }
    catch(error){
        console.log(error)
    }
}

getBfroData()