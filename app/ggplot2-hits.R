library('ggplot2')
success.rate <- data.frame(hits       = c(samepop.t30.hits.g10$hits,samepop.t30.hits.p$hits),
                           population=c(samepop.t30.hits.g10$population,samepop.t30.hits.p$population),
                           architecture=c(rep('P2P',4),rep('Pool',4)),
                           levels= samepop.t30.hits.g10$population )
ggplot( data=success.rate,aes(x=population,y=hits,group=architecture,color=architecture)) +
  geom_line() + geom_point() +
  xlab("Population") + ylab("Success rate (30 runs)")
ggsave('success-rate-arch.png',width=8,height=8,dpi=100)


