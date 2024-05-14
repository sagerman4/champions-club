provider "aws" {
  region = "us-east-1"
}

# Elastic Beanstalk application
resource "aws_elastic_beanstalk_application" "myapp" {
  name        = "champions-club-application"
  description = "Champions Club Nest.js Application"

  lifecycle {
    prevent_destroy = true
  }
}

# Elastic Beanstalk environment using the application
resource "aws_elastic_beanstalk_environment" "myenv" {
  name                = "ChampionsClub-env"
  application         = aws_elastic_beanstalk_application.myapp.name
  solution_stack_name = "64bit Amazon Linux 2023 v6.1.4 running Node.js 20"
  wait_for_ready_timeout = "30m"

  setting {
    namespace = "aws:elasticbeanstalk:environment:process:default"
    name      = "Port"
    value     = "8080"
  }

  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MinSize"
    value     = "1"
  }

  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MaxSize"
    value     = "3"
  }
}
