 plot(samepop.t30.hits.g10, type='b',log='x',xlim=c(32,256),ylim=c(0,30),ylab='Success/30', main='Number of successful runs', lwd='3')
lines(samepop.t30.hits.p, type='b',lty=2, col='red',lwd='3' )
legend(150,5,c('P2P','Pool'),col=c('black','red'),lty=c(1,2),lwd=c(3,3))
