---
title: Harmful Algal Bloom (HAB) Prediction
team:
  - AthulithParaselli(TeamLead)
  - CiroZhang
  - Nian-NianWang
  - EstherChung
start_date: 2025-01-28T19:30:00.000-08:00
type: Data Science
preview_image: /images/projects/hab_model_flow.png
status: past
winner_status: not winner
keywords:
  - DSC
  - machinelearning
  - AI
  - webdevelopment
  - oceanography
---
Harmful algal blooms can damage marine ecosystems and release toxins. In Southern California, Lingulodinium polyedrum is a common bioluminescent algae species responsible for glowing blue waves. Bloom dynamics are highly nonlinear and influenced by many interacting environmental factors, making accurate forecasting difficult using traditional models. However, the team was able to develop a working model that predicts these blooms with an 80% true positive rate.

Environmental variables are first processed using Empirical Dynamic Modeling (EDM) to capture nonlinear ecological dynamics. A trust-gate attention mechanism filters important features, while convolution layers extract short-term temporal patterns. Finally, an LSTM models long-term dependencies to generate bloom forecasts.
