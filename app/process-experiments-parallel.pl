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
my $how_many = shift || 2;

my @files = glob $prefix_files."-*.json";

my $hits;
my @times;
my $success;
for my $f (@files ) {
  $success = 0;
  my $experiment =  json_file_to_perl($f);
  my $start_time = nanos(@{$experiment->[1]->{'start'}}) ;
  say "Start ", $start_time;
  my $last = $experiment->[@$experiment -1] ;
  say "End ", nanos(@{$last->{'end'}{'time'}}), " D ",  nanos(@{$last->{'end'}{'time'}}) - $start_time;
  my $best_duration =(nanos(@{$last->{'end'}{'time'}}) - $start_time)/1e6;
  my $success;
  for my $i (2..$how_many) {
    my $other_file =  $f;
    $other_file =~ s/-1-/-$i-/;
    $experiment= json_file_to_perl($other_file);
    $start_time = nanos(@{$experiment->[1]->{'start'}});
    say "Start ", $start_time;
    $last= $experiment->[@$experiment -1];
    say "End ", nanos(@{$last->{'end'}{'time'}}), " D ",  nanos(@{$last->{'end'}{'time'}}) - $start_time;
    my $this_duration = (nanos(@{$last->{'end'}{'time'}}) - $start_time)/1e6;
    if ( $this_duration < $best_duration ) {
      $best_duration = $this_duration;
    }
    if ( $last->{'end'}{'best'}{'fitness'} == $target_fitness ) {
      $success = 1;
    }
  }
  if ( $success ) {
    $hits++;
    push @times, $best_duration;
  }

}


say "Success rate :", $hits/@files;
say "Times: ", join(", ", @times);


sub nanos {
  return $_[0]*1e9+$_[1];
}

