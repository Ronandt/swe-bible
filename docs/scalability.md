---
id: scalability
title: Scalability
sidebar_label: Scalability
sidebar_position: 7
---

# Scalability

Most of the time, your backend will never be exposed or accessible directly to the frontend. Instead, you will use a **reverse proxy** such as [Caddy](https://caddyserver.com/), [Traefik](https://traefik.io/traefik), or [Nginx](https://nginx.org/). Most of these services fulfil more than one role.

## Reverse Proxy Comparison

| Feature | Caddy | Traefik | Nginx |
|---------|-------|---------|-------|
| **TLS** | Self-serves | Self-serves via Let's Encrypt | Does not serve SSL |
| **Ease of config** | Easy to setup from documentation | Easy for Docker, harder for bare metal | Hardest to configure |
| **Ease of integration** | Easy integration bare metal | Easy and well-documented in k8s | Manual configuration required |
| **Documentation** | Documentation for Caddyfile (bare metal) | Mostly Docker docs | Manual configuration for both |
| **Performance** | Small overhead | Most overhead | Fastest |
| **Other functions** | File sharing | Rate limiting | File sharing, rate limiting, proxy caching |

## Load Balancer

Load balancers use different algorithms to distribute network traffic to different instances of the server. In certain cases, this will require a change of code structure — such as accessing a centralised database or accessing shared data.

## Reverse Proxy

A reverse proxy is a proxy connection that receives connections from your user, so they do not directly connect to the backend. This provides an additional level of security as you are able to block unwanted network traffic before sending data to your backend.

:::note
Concrete examples for Kubernetes, Docker, and bare metal configurations will be added in future updates.
:::
