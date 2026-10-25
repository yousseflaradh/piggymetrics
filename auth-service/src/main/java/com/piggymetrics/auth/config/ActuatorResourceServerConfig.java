package com.piggymetrics.auth.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;

/**
 * Lets Prometheus read /actuator/health and /actuator/prometheus without a token.
 * Every other request still needs an OAuth2 token, as before.
 */
@Configuration
public class ActuatorResourceServerConfig extends ResourceServerConfigurerAdapter {

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/actuator/health", "/actuator/prometheus").permitAll()
                .anyRequest().authenticated();
    }
}
