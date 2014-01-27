#!/usr/bin/env perl

use strict;
use warnings;
use v5.12;

use JSON::Parse 'json_file_to_perl';
use File::Slurp;

=head1 NAME

  process_experiments.pl - processes experiment data created by run_experiment.pl

=head1 SYNOPSIS

  prompt% ./process_experimentss.pl <target-fitness> <file preffix>


=head1 DESCRIPTION  

Processes and gets stuff from experiments

=cut

my $target_fitness = shift || die "Don't know target fitness\n";
my $prefix_files = shift || die "Tell me the files \n";

my @files = glob $prefix_files."-*.dat";

my $hits;
my @times;
for my $f (@files ) {
  my $experiment = json_file_to_perl($f);
  my $start_time = join(".",@{$experiment->[1]->{'start'}});
  my $last =$experiment->[@$experiment -1];
  if ( $last->{'end'}{'best'}{'fitness'} == $target_fitness ) {
    $hits ++; 
    push @times, join(".",@{$last->{'end'}{'time'}}) - $start_time;
  }
}

say "Success rate :", $hits/@files;
say "Times: ", join(", ", @times);


