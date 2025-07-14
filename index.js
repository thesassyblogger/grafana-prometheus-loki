const express = require("express");
const responseTime = require("response-time")
const {doSomeHeavyTask} = require("./util");
const client = require("prom-client");
const { createLogger, transports } = require("winston");
const LokiTransport = require("winston-loki");
const options = {
  transports: [
    new LokiTransport({
      host: "http://127.0.0.1:3100"
    })
  ]
};
const logger = createLogger(options);


const app = express();
const PORT = process.env.PORT || 8000;

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({ register: client.register});

const reqResTime = new client.Histogram({
    name: "http_express_req_res_time",
    help: " This is how much time is taken by req and res",
    labelNames:     ['method', 'route', 'status_code'],
    buckets: [1, 50, 100, 200, 400, 500, 800, 1000, 2000, 3000]
});

const totalReqCounter = new client.Counter({
    name: 'total_req',
    help: 'tells total req'
})

app.use(responseTime((req, res, time)=>{
    totalReqCounter.inc();
    reqResTime.labels({
        method:req.method,
        route: req.url,
        status_code: res.statusCode
    }).observe(time);

}))

app.get("/", (req, res) => {
    logger.info('Req came from / route');
    return res.json({message: "successfull"});
});

app.get("/slow", async (req, res) => {
        logger.info('Req came from /slow route');

    try {
         const shouldFail = Math.random() < 0.3; // 30% chance of failure

        if (shouldFail) {
            throw new Error("Simulated server error");
        }

        const timeTaken = await doSomeHeavyTask();
        return res.json({
            status: "Success",
            message: `Heavy task completed in ${timeTaken}ms `
        });
    } catch (error) {
        logger.error(error.message);

        return res
        .status(500)
        .json({status: "Error", error: "Interval Server Error"})
    }
});

app.get("/metrics", async (req, res) => {
    res.setHeader('Content-Type', client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics)
})

app.listen(PORT, () => console.log(`Express Server started at http://localhost:${PORT}`));