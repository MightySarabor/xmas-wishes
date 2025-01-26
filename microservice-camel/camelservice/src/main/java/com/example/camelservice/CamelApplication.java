package com.example.camelservice;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.main.Main;

public class CamelApplication {

    public static void main(String[] args) throws Exception {
        Main main = new Main();
        main.configure().addRoutesBuilder(new PdfToJsonRoute());
        main.run(args);
    }

    static class PdfToJsonRoute extends RouteBuilder {
        @Override
        public void configure() throws Exception {
            from("file:src/data?noop=true&include=.*.pdf")
                .routeId("pdfToJsonRoute")
                .process(exchange -> {
                    // Hier kannst du die PDF-Datei einlesen und verarbeiten
                    // Zum Demonstrationszweck senden wir eine festgelegte JSON-Nachricht
                    String jsonMessage = "{\"message\": \"This is a fixed JSON message\"}";
                    exchange.getIn().setBody(jsonMessage);
                })
                .to("kafka:{{camel.component.kafka.brokers}}?topic=initial-topic");
        }
    }
}
