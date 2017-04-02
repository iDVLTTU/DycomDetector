## DycomDetector: Discover topics using automatic community detections in dynamic networks
Please click to watch the overview video.
[![ScreenShot](.png)](.mp4)
Online demo:  https://idvlttu.github.io/DycomDetector/

Due to the rapid expansion and heterogeneity of the data, it is a challenging task to find out the patterns and relationships in the data. We introduce DycomDetector, a novel visualization tools for representing the relationships of temporal datasets. Our algorithm extracts the topics and creates relationships based on the collocation of the terms from the real world datasets such as political blogs. Based on the relationships and frequency of the words, DycomDetector constructs networks of a particular period and show the communities in the networks. The interactive and intuitive interface of our system enables the users to explore the data using various filter and lensing, to construct the networks using various parameters such as sudden change, degree, betweenness centrality, etc. It also allows the users to search a particular topic and visualize the relations of that topic with others terms in different time points. 

We collected 90,811 political blog posts over a ten-year period from 2005 to 2015 from seven different sources, including Wikinews, Americablog, The Huffington Post, and ProPublica. We then ran text analysis on these blogs and generated 418,641 terms that were classified into four different categories. We demonstrate the application of the DycomDetector on those datasets to analyze and evaluate its capabilities. Please try [online demo](http://www2.cs.uic.edu/~tdang/TimeArcs/Text/).

![ScreenShot](https://github.com/iDataVisualizationLab/DycomDetector/blob/master/images/Figure1.png)

Viewers can lens into a period of time to see the details by mousing over the time axis. The following figure depicts lensing into 2013. 












