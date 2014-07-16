library('ggplot2')
success.rate <- data.frame(t       = c(samepop.t30.t.g10$hits,samepop.t30.t.p$hits),
                           population=c(samepop.t30.t.g10$population,samepop.t30.t.p$population),
                           architecture=c(rep('P2P',4),rep('Pool',4)),
                           levels= samepop.t30.t.g10$population )
ggplot( data=success.rate,aes(x=population,y=t,group=architecture,color=architecture)) +
  geom_line() + geom_point() +
  xlab("Population") + ylab("Time (ms.)")
ggsave('time-arch.png',width=8,height=8,dpi=100)


