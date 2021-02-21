const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
const port = process.env.PORT || 4000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post("/", (req, res) => {
    console.log(req.body);
    if (req.body.events.length != 0) {
        let reply_token = req.body.events[0].replyToken;
        let msg = req.body.events[0].message.text;
        reply(reply_token, msg);
    }
    res.sendStatus(200);
});
app.listen(port);

function reply(reply_token, msg) {
    let headers = {
        "Content-Type": "application/json",
        Authorization:
            "Bearer ",
    };

    if (msg == "รายงานcovid") {
        var url = "https://covid19.th-stat.com/api/open/today";
        request(url, function (error, response, body) {
            var body = JSON.parse(body);
           var  messages2 = [
                {
                    type: "text",
                    text: "อัพเดตผู้ป่วยโควิด 19 ใหม่ในไทย ประจำวันที่ : " + body.UpdateDate,
                },
                {
                    type: "text",
                    text: "จำนวนผู้ติดเชื้อรายใหม่ : " + body.NewConfirmed + " คน",
                },
                {
                    type: "text",
                    text: "จำนวนผู้ป่วยที่รักษาหาย : " + body.NewRecovered + " คน",
                },
                {
                    type: "text",
                    text: "จำนวนผู้เสียชีวิต : " + body.NewDeaths + " คน",
                },
                {
                    type: "text",
                    text: "จำนวนผู้ติดเชื้อสะสมทั้งหมด : " + body.Confirmed + " คน",
                },
            ];

            let message = JSON.stringify({
                replyToken: reply_token,
                messages: messages2,
            });

            request.post(
                {
                    url: "https://api.line.me/v2/bot/message/reply",
                    headers: headers,
                    body: message,
                },
                (err, res, body) => {
                    console.log("status = " + res.statusCode);
                }
            );
        });
    } else {
       var  messages2 = [
            {
                type: "text",
                text: "ลองพิมพ์ รายงานcovid ",
            },
        ];

        let message = JSON.stringify({
            replyToken: reply_token,
            messages: messages2,
        });

        request.post(
            {
                url: "https://api.line.me/v2/bot/message/reply",
                headers: headers,
                body: message,
            },
            (err, res, body) => {
                console.log("status = " + res.statusCode);
            }
        );
    }


}
